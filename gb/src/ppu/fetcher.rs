use crate::{constants::TILE_WIDTH, traits::MemoryAccess};

use super::{
    ppu::MapLayer,
    utils::{
        get_background_tile_map_address, get_window_tile_map_address, transform_tile_number,
        LcdcBits,
    },
    vram::{BgToOamPriority, TileAttributes, Vram},
};

#[derive(Clone, Copy, PartialEq, Eq)]
enum FetcherStep {
    GetTileId,
    GetTileLow,
    GetTileHigh,
    Push,
}

/// A single pixel in the BG FIFO - color index + attributes (CGB palette, BG-to-OAM priority)
#[derive(Clone, Copy)]
pub struct FifoItem {
    pub color_number: u8,
    pub priority: BgToOamPriority,
    pub palette: u8,
}

impl FifoItem {
    const EMPTY: FifoItem = FifoItem {
        color_number: 0,
        priority: BgToOamPriority::OamPriorityBit,
        palette: 0,
    };

    fn new(color_number: u8, attributes: &TileAttributes) -> Self {
        Self {
            color_number,
            priority: attributes.priority,
            palette: attributes.bg_palette_index,
        }
    }
}

/// BG pixel FIFO (consumer) - shifts out exactly one pixel per dot to the LCD.
/// Holds up to 8 pixels (one tile slice) and accepts new pixels only when empty.
/// Only the fetcher pushes into it, the PPU shifts pixels out (and clears it on window trigger).
pub struct BgFifo {
    pixels: [FifoItem; TILE_WIDTH],
    len: usize,
}

impl BgFifo {
    pub fn new() -> Self {
        Self {
            pixels: [FifoItem::EMPTY; TILE_WIDTH],
            len: 0,
        }
    }

    pub fn is_empty(&self) -> bool {
        self.len == 0
    }

    pub fn clear(&mut self) {
        self.len = 0;
    }

    pub fn shift(&mut self) -> Option<FifoItem> {
        if self.len == 0 {
            return None;
        }
        let item = self.pixels[TILE_WIDTH - self.len];
        self.len -= 1;
        Some(item)
    }

    /// Returns false (pixels are not accepted) if the FIFO is not empty
    fn push(&mut self, low: u8, high: u8, attributes: &TileAttributes) -> bool {
        if !self.is_empty() {
            return false;
        }
        for (i, pixel) in self.pixels.iter_mut().enumerate() {
            let bit = 7 - i;
            let color_number = (((high >> bit) & 1) << 1) | ((low >> bit) & 1);
            *pixel = FifoItem::new(color_number, attributes);
        }
        self.len = TILE_WIDTH;
        true
    }
}

/// BG/Window fetcher (producer) - reads one tile slice (8 pixels) from VRAM over several dots.
/// Each of the first 3 steps takes 2 dots (VRAM is accessed on the second one), then it attempts
/// to push the pixels to the BG FIFO every dot. Fetching (~6 dots) is faster than draining
/// the FIFO (8 dots), so the FIFO never runs dry. Kept separate from the FIFO as on hardware,
/// the slice fetcher will be shared with the OBJ FIFO.
pub struct Fetcher {
    pub layer: MapLayer,
    is_cgb: bool,
    // Tile column counter, relative to the layer (SCX for BG, 0 for Window)
    tile_x: u8,
    window_y: u8,
    tile_id: u8,
    tile_attributes: TileAttributes,
    tile_data_low: u8,
    tile_data_high: u8,
    step: FetcherStep,
    step_dot: u8,
    // Dots before the fetcher starts working (the very beginning of mode 3)
    idle_dots: u8,
    // The first fetch of the line is done twice, the first result is thrown away
    discard_next_push: bool,
}

impl Fetcher {
    pub fn new(is_cgb: bool) -> Fetcher {
        Fetcher {
            is_cgb,
            layer: MapLayer::Background,
            tile_x: 0,
            window_y: 0,
            tile_id: 0,
            tile_attributes: TileAttributes::new(),
            tile_data_low: 0,
            tile_data_high: 0,
            step: FetcherStep::GetTileId,
            step_dot: 0,
            idle_dots: 0,
            discard_next_push: false,
        }
    }

    fn reset(&mut self, layer: MapLayer) {
        self.layer = layer;
        self.tile_x = 0;
        self.step = FetcherStep::GetTileId;
        self.step_dot = 0;
        self.idle_dots = 0;
        self.discard_next_push = false;
    }

    pub fn start_line(&mut self, idle_dots: u8) {
        self.reset(MapLayer::Background);
        self.idle_dots = idle_dots;
        self.discard_next_push = true;
    }

    pub fn start_window(&mut self, window_y: u8) {
        self.reset(MapLayer::Window);
        self.window_y = window_y;
        // The dot of the window trigger is the first dot of the tile ID fetch
        self.step_dot = 1;
    }

    fn tile_y(&self, bg_y: u8) -> u8 {
        match self.layer {
            MapLayer::Background => bg_y,
            MapLayer::Window => self.window_y,
        }
    }

    // LCDC.4 is checked at the moment of the tile data read
    fn read_tile_data(&self, vram: &Vram, lcdc: &LcdcBits, bg_y: u8, high: bool) -> u8 {
        let tile_number = transform_tile_number(lcdc, self.tile_id);
        let tile_row = (self.tile_y(bg_y) % 8) as usize;
        if high {
            vram.get_tile_high(tile_number, tile_row, &self.tile_attributes)
        } else {
            vram.get_tile_low(tile_number, tile_row, &self.tile_attributes)
        }
    }

    /// `scx` and `bg_y` (LY + SCY) are the current register values, they are re-read on every access
    pub fn tick(&mut self, vram: &Vram, lcdc: &LcdcBits, scx: u8, bg_y: u8, fifo: &mut BgFifo) {
        if self.idle_dots > 0 {
            self.idle_dots -= 1;
            return;
        }

        if self.step == FetcherStep::Push {
            self.push(fifo);
            return;
        }

        // VRAM is accessed on the second dot of the step
        self.step_dot += 1;
        if self.step_dot < 2 {
            return;
        }
        self.step_dot = 0;

        match self.step {
            FetcherStep::GetTileId => {
                let (map_address, tile_row, tile_col) = match self.layer {
                    MapLayer::Background => (
                        get_background_tile_map_address(lcdc),
                        bg_y / 8,
                        ((scx / 8).wrapping_add(self.tile_x)) & 0x1f,
                    ),
                    MapLayer::Window => (
                        get_window_tile_map_address(lcdc),
                        self.window_y / 8,
                        self.tile_x & 0x1f,
                    ),
                };
                let tile_address = map_address + tile_row as u16 * 32 + tile_col as u16;

                self.tile_id = vram.read_byte(tile_address);
                self.tile_attributes = if self.is_cgb {
                    vram.get_tile_attributes(tile_address)
                } else {
                    TileAttributes::new()
                };
                self.step = FetcherStep::GetTileLow;
            }
            FetcherStep::GetTileLow => {
                self.tile_data_low = self.read_tile_data(vram, lcdc, bg_y, false);
                self.step = FetcherStep::GetTileHigh;
            }
            FetcherStep::GetTileHigh => {
                self.tile_data_high = self.read_tile_data(vram, lcdc, bg_y, true);
                self.step = FetcherStep::Push;
            }
            FetcherStep::Push => unreachable!(),
        }
    }

    fn push(&mut self, fifo: &mut BgFifo) {
        if self.discard_next_push {
            self.discard_next_push = false;
        } else if fifo.push(self.tile_data_low, self.tile_data_high, &self.tile_attributes) {
            self.tile_x = self.tile_x.wrapping_add(1);
        } else {
            return;
        }
        self.step = FetcherStep::GetTileId;
    }
}
