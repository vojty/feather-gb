use std::collections::VecDeque;

use super::{
    ppu::MapLayer,
    utils::{
        get_background_tile_map_address, get_window_tile_map_address, transform_tile_number,
        LcdcBits,
    },
    vram::Vram,
};

enum FetchState {
    ReadTileNumber,
    ReadTileData0,
    ReadTileData1,
    PushToFIFO,
}

pub struct Fetcher {
    pub mode: MapLayer,
    x: u32,
    y: u32,
    tile_number: usize,
    tile_offset: u32,
    state: FetchState,
    fifo: VecDeque<u8>,
    cycles: u8,
}

impl Fetcher {
    pub fn new() -> Fetcher {
        Fetcher {
            mode: MapLayer::Background,
            x: 0,
            y: 0,
            tile_number: 0,
            tile_offset: 0,
            state: FetchState::ReadTileNumber,
            fifo: VecDeque::new(),
            cycles: 0,
        }
    }

    pub fn start(&mut self, x: u8, y: u8, mode: MapLayer) {
        self.x = x.into();
        self.y = y.into();
        self.tile_number = 0;
        self.tile_offset = 0;
        self.cycles = 0;
        self.fifo.clear();
        self.state = FetchState::ReadTileNumber;
        self.mode = mode;
    }

    pub fn len(&self) -> usize {
        self.fifo.len()
    }

    pub fn shift(&mut self) -> Option<u8> {
        self.fifo.pop_front()
    }

    pub fn tick(&mut self, vram: &Vram, lcdc: &LcdcBits) {
        self.cycles += 1;
        if self.cycles < 2 {
            return;
        }
        self.cycles = 0;

        match self.state {
            FetchState::ReadTileNumber => {
                let map_address = match self.mode {
                    MapLayer::Background => get_background_tile_map_address(lcdc),
                    MapLayer::Window => get_window_tile_map_address(lcdc),
                } as usize;

                let tile_row = ((self.y & 0xff) / 8) as usize; // floor not needed, rust handles that
                let tile_col = (((self.x + self.tile_offset * 8) & 0xff) / 8) as usize;
                let tile_address = (map_address + (tile_row * 32 + tile_col)) as usize;
                let n = vram.memory[tile_address] as usize;
                self.tile_number = transform_tile_number(lcdc, n);
                self.state = FetchState::ReadTileData0;
            }
            FetchState::ReadTileData0 => {
                self.state = FetchState::ReadTileData1;
            }
            FetchState::ReadTileData1 => {
                self.state = FetchState::PushToFIFO;
            }
            FetchState::PushToFIFO => {
                // TODO check this if
                if self.fifo.len() <= 8 {
                    let tile = &vram.tiles[self.tile_number];
                    let index = (self.y & 7) as usize;
                    let line_pixels = &tile.data[index];

                    for pixel in line_pixels.iter() {
                        self.fifo.push_back(*pixel);
                    }
                    self.tile_offset += 1;
                    self.state = FetchState::ReadTileNumber;
                }
            }
        }
    }
}
