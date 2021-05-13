use std::collections::VecDeque;

use crate::traits::MemoryAccess;

use super::{
    ppu::MapLayer,
    utils::{
        get_background_tile_map_address, get_window_tile_map_address, transform_tile_number,
        LcdcBits,
    },
    vram::{TileAttributes, Vram},
};

enum FetcherState {
    ReadTileNumber,
    ReadTileData0,
    ReadTileData1,
    PushToFifo,
}

pub struct Fetcher {
    pub mode: MapLayer,
    is_cgb: bool,
    x: u8,
    y: u8,
    tile_number: usize,
    tile_attributes: TileAttributes,
    tile_offset: u32,
    tile_data_lower: u8,
    tile_data_upper: u8,
    state: FetcherState,
    fifo: VecDeque<u8>,
    cycles: u8,
}

fn get_bit(byte: u8, index: usize) -> u8 {
    if byte & (1 << index) > 0 {
        return 1;
    }
    0
}

impl Fetcher {
    pub fn new(is_cgb: bool) -> Fetcher {
        Fetcher {
            is_cgb,
            mode: MapLayer::Background,
            x: 0,
            y: 0,
            tile_number: 0,
            tile_attributes: TileAttributes::new(),
            tile_data_upper: 0,
            tile_data_lower: 0,

            tile_offset: 0,
            state: FetcherState::ReadTileNumber,
            fifo: VecDeque::new(),
            cycles: 0,
        }
    }

    pub fn start(&mut self, x: u8, y: u8, mode: MapLayer) {
        self.x = x;
        self.y = y;
        self.tile_number = 0;
        self.tile_offset = 0;
        self.cycles = 0;
        self.fifo.clear();
        self.state = FetcherState::ReadTileNumber;
        self.mode = mode;
    }

    pub fn len(&self) -> usize {
        self.fifo.len()
    }

    pub fn shift(&mut self) -> Option<u8> {
        self.fifo.pop_front()
    }

    pub fn tick(&mut self, vram: &Vram, lcdc: &LcdcBits, bg_y: u8) {
        self.cycles += 1;
        if self.cycles < 2 {
            return;
        }
        self.cycles = 0;

        // TODO refactor this ugly code
        // workaround for SCY immediate change
        let y = if self.mode == MapLayer::Window {
            self.y
        } else {
            bg_y
        };

        match self.state {
            FetcherState::ReadTileNumber => {
                let map_address = match self.mode {
                    MapLayer::Background => get_background_tile_map_address(lcdc),
                    MapLayer::Window => get_window_tile_map_address(lcdc),
                };

                let tile_row = (y / 8) as u16;
                let tile_col = (((self.x as u32 + self.tile_offset * 8) & 0xff) / 8) as u16;
                let tile_address = map_address + (tile_row * 32 + tile_col);

                let n = vram.read_byte(tile_address);
                self.tile_number = transform_tile_number(lcdc, n);
                self.state = FetcherState::ReadTileData0;

                if self.is_cgb {
                    self.tile_attributes = vram.get_tile_attributes(tile_address);
                }
            }
            FetcherState::ReadTileData0 => {
                self.tile_data_lower =
                    vram.get_tile_low(self.tile_number, y as usize, self.get_bank_number());
                self.state = FetcherState::ReadTileData1;
            }
            FetcherState::ReadTileData1 => {
                self.tile_data_upper =
                    vram.get_tile_high(self.tile_number, y as usize, self.get_bank_number());
                self.state = FetcherState::PushToFifo;
            }
            FetcherState::PushToFifo => {
                if self.fifo.len() <= 8 {
                    for x in (0..=7).rev() {
                        let high = get_bit(self.tile_data_upper, x);
                        let low = get_bit(self.tile_data_lower, x);
                        let pixel = (high << 1) | low;
                        self.fifo.push_back(pixel);
                    }

                    self.tile_offset += 1;
                    self.state = FetcherState::ReadTileNumber;
                }
            }
        }
    }

    fn get_bank_number(&self) -> u8 {
        if !self.is_cgb {
            return 0;
        }

        self.tile_attributes.bank_number
    }
}
