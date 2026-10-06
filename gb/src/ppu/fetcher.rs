use crate::{constants::TILE_WIDTH, traits::MemoryAccess};

use super::{
    ppu::MapLayer,
    utils::{
        get_background_tile_map_address, get_window_tile_map_address, is_window_enabled,
        transform_tile_number, LcdcBits,
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
    pub const EMPTY: FifoItem = FifoItem {
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

#[derive(Clone, Copy)]
struct StepInputs {
    lcdc: u8,
    scx: u8,
}

/// BG/Window fetcher (producer) - reads one tile slice (8 pixels) from VRAM over several dots.
/// Each of the first 3 steps takes 2 dots (VRAM is accessed on the second one), then it attempts
/// to push the pixels to the BG FIFO every dot. Fetching (~6 dots) is faster than draining
/// the FIFO (8 dots), so the FIFO never runs dry. Kept separate from the FIFO as on hardware,
/// the slice fetcher will be shared with the OBJ FIFO.
pub struct Fetcher {
    pub layer: MapLayer,
    is_cgb: bool,
    // BG tile column counter (relative to SCX). It keeps counting while the window is fetched
    // (except the first window tile), so the BG continues from there if the window is disabled.
    bg_tile_x: u8,
    window_tile_x: u8,
    window_y: u8,
    tile_id: u8,
    tile_attributes: TileAttributes,
    tile_data_low: u8,
    tile_data_high: u8,
    step: FetcherStep,
    // Register values latched on the first dot of the current step (None - the step hasn't started)
    latched: Option<StepInputs>,
    // The first fetch after the line start (the junk tile, only shifted out during LX 0-7) or after
    // the window trigger. It doesn't advance the BG tile counter.
    first_fetch: bool,
}

impl Fetcher {
    pub fn new(is_cgb: bool) -> Fetcher {
        Fetcher {
            is_cgb,
            layer: MapLayer::Background,
            bg_tile_x: 0,
            window_tile_x: 0,
            window_y: 0,
            tile_id: 0,
            tile_attributes: TileAttributes::new(),
            tile_data_low: 0,
            tile_data_high: 0,
            step: FetcherStep::GetTileId,
            latched: None,
            first_fetch: false,
        }
    }

    fn restart(&mut self, layer: MapLayer) {
        self.layer = layer;
        self.first_fetch = true;
        self.step = FetcherStep::GetTileId;
        self.latched = None;
    }

    pub fn start_line(&mut self) {
        self.restart(MapLayer::Background);
        self.bg_tile_x = 0;
    }

    /// The tile ID fetch starts on the next dot, unless `latch` is called in this dot
    pub fn start_window(&mut self, window_y: u8) {
        self.restart(MapLayer::Window);
        self.window_tile_x = 0;
        self.window_y = window_y;
    }

    /// The first tile after the line start or the window trigger is being fetched/pushed
    /// (also if the window has been aborted during it)
    pub fn is_first_fetch(&self) -> bool {
        self.first_fetch
    }

    fn tile_y(&self, bg_y: u8) -> u8 {
        match self.layer {
            MapLayer::Background => bg_y,
            MapLayer::Window => self.window_y,
        }
    }

    // LCDC.4 is latched on the first dot of the step
    fn read_tile_data(&self, vram: &Vram, lcdc: &LcdcBits, bg_y: u8, high: bool) -> u8 {
        let tile_number = transform_tile_number(lcdc, self.tile_id);
        let tile_row = (self.tile_y(bg_y) % 8) as usize;
        if high {
            vram.get_tile_high(tile_number, tile_row, &self.tile_attributes)
        } else {
            vram.get_tile_low(tile_number, tile_row, &self.tile_attributes)
        }
    }

    /// `scx` and `bg_y` (LY + SCY) are the current register values.
    /// Returns true if the pixels were pushed to the FIFO in this dot.
    pub fn tick(
        &mut self,
        vram: &Vram,
        lcdc: &LcdcBits,
        scx: u8,
        bg_y: u8,
        fifo: &mut BgFifo,
    ) -> bool {
        if self.step == FetcherStep::Push {
            if !fifo.push(
                self.tile_data_low,
                self.tile_data_high,
                &self.tile_attributes,
            ) {
                return false;
            }
            self.first_fetch = false;
            self.step = FetcherStep::GetTileId;
            // The push dot is also the first dot of the next tile ID fetch
            self.latch(lcdc, scx);
            return true;
        }

        // VRAM is accessed on the second dot of the step. SCX and LCDC are latched on the first
        // dot (the address is computed), SCY is read on the access dot (DMG reads it on every step)
        let Some(inputs) = self.latched.take() else {
            self.latch(lcdc, scx);
            return false;
        };
        let lcdc = &LcdcBits::from_bits_truncate(inputs.lcdc);

        // The window is aborted when it's disabled at the start of the tile ID fetch (the push dot,
        // or the window trigger dot), the fetcher continues with the BG
        if self.step == FetcherStep::GetTileId
            && self.layer == MapLayer::Window
            && !is_window_enabled(lcdc)
        {
            self.layer = MapLayer::Background;
        }

        match self.step {
            FetcherStep::GetTileId => {
                let (map_address, tile_row, tile_col) = match self.layer {
                    MapLayer::Background => (
                        get_background_tile_map_address(lcdc),
                        bg_y / 8,
                        ((inputs.scx / 8).wrapping_add(self.bg_tile_x)) & 0x1f,
                    ),
                    MapLayer::Window => (
                        get_window_tile_map_address(lcdc),
                        self.window_y / 8,
                        self.window_tile_x & 0x1f,
                    ),
                };
                let tile_address = map_address + tile_row as u16 * 32 + tile_col as u16;

                self.tile_id = vram.read_byte(tile_address);
                self.tile_attributes = if self.is_cgb {
                    vram.get_tile_attributes(tile_address)
                } else {
                    TileAttributes::new()
                };
                if self.layer == MapLayer::Window {
                    self.window_tile_x = self.window_tile_x.wrapping_add(1);
                }
                self.step = FetcherStep::GetTileLow;
            }
            FetcherStep::GetTileLow => {
                self.tile_data_low = self.read_tile_data(vram, lcdc, bg_y, false);
                self.step = FetcherStep::GetTileHigh;
            }
            FetcherStep::GetTileHigh => {
                self.tile_data_high = self.read_tile_data(vram, lcdc, bg_y, true);
                // The BG tile counter advances once the slice is fetched (even if the push is
                // then aborted by the window), but not for the junk and the first window fetch
                if !self.first_fetch {
                    self.bg_tile_x = self.bg_tile_x.wrapping_add(1);
                }
                self.step = FetcherStep::Push;
            }
            FetcherStep::Push => unreachable!(),
        }
        false
    }

    /// The first dot of a fetch step - SCX and LCDC for the VRAM address are latched
    pub fn latch(&mut self, lcdc: &LcdcBits, scx: u8) {
        self.latched = Some(StepInputs {
            lcdc: lcdc.bits(),
            scx,
        });
    }

    /// An object fetch can start only once the BG tile data is fetched (the fetcher waits
    /// for the high byte read or for the push)
    pub fn is_ready_for_object(&self) -> bool {
        self.step == FetcherStep::Push
            || (self.step == FetcherStep::GetTileHigh && self.latched.is_some())
    }
}
