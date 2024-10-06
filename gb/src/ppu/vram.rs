use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use crate::constants::TILE_SIZE;
use crate::traits::MemoryAccess;

use super::registers::R_VBK;

pub const VRAM_START: u16 = 0x8000;
pub const VRAM_END: u16 = 0x9fff;
const TILES_COUNT: usize = 384;
// Tiles        0x8000 -> 0x97FF 8x8 pixels, 384 tiles
// Tile maps    0x9800 -> 0x9BFF
//              0x9C00 -> 0x9FFF
// CGB has extra VRAM bank, tiles are doubled and 0x9800 -> 0x9FFF is reserved for BG Map Attributes

const DATA_MASK: u16 = 0x1fff;

const VRAM_SIZE: usize = VRAM_END as usize - VRAM_START as usize + 1;

#[derive(Hash, Clone, Copy, PartialEq, Eq)]
pub enum BgToOamPriority {
    OamPriorityBit, // Object has priority according to its priority flag (DMG behavior)
    BgPriority,     // BG tile is always on top of the objects
}

#[derive(Hash)]
pub struct TileAttributes {
    // Bit 7        BG-to-OAM Priority          (0=Use OAM Priority bit, 1=BG Priority)
    // Bit 6        Vertical Flip               (0=Normal, 1=Mirror vertically)
    // Bit 5        Horizontal Flip             (0=Normal, 1=Mirror horizontally)
    // Bit 4        Not used
    // Bit 3        Tile VRAM Bank number       (0=Bank 0, 1=Bank 1)
    // Bit 2-0      Background Palette number   (BGP0-7)
    pub bank_number: u8,
    pub is_y_flipped: bool,
    pub is_x_flipped: bool,
    pub priority: BgToOamPriority,
    pub bg_palette_index: u8,
}

impl TileAttributes {
    pub fn new() -> Self {
        // DMG defaults
        Self {
            bank_number: 0,
            is_x_flipped: false,
            is_y_flipped: false,
            priority: BgToOamPriority::OamPriorityBit,
            bg_palette_index: 0,
        }
    }

    pub fn from_bits(bits: u8) -> Self {
        let bg_palette_index = bits & 0b000_0111;
        let bank_number = (bits & 0b0000_1000) >> 3;
        let is_x_flipped = (bits & 0b0010_0000) > 0;
        let is_y_flipped = (bits & 0b0100_0000) > 0;
        let priority = if (bits & 0b1000_0000) > 0 {
            BgToOamPriority::BgPriority
        } else {
            BgToOamPriority::OamPriorityBit
        };
        Self {
            bank_number,
            is_y_flipped,
            is_x_flipped,
            priority,
            bg_palette_index,
        }
    }
}

#[derive(Clone, Copy, Hash)]
pub struct Tile {
    pub data: [[u8; 8]; 8],
}

impl Tile {
    pub fn new() -> Tile {
        Tile { data: [[0; 8]; 8] }
    }

    pub fn get_at(&self, x: usize, y: usize) -> u8 {
        self.data[y][x]
    }
}

pub struct Vram {
    pub memory: Box<[u8]>,
    pub tiles: Box<[Tile]>,
    bank: u8,
}

fn get_bit(byte: u8, index: usize) -> u8 {
    if byte & (1 << index) > 0 {
        return 1;
    }
    0
}

fn calculate_hash<T: Hash>(t: &T) -> u64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    s.finish()
}

enum TileData {
    Low,
    High,
}

impl Vram {
    pub fn new() -> Vram {
        // CGB has doubled VRAM size (extra ram bank)
        Vram {
            bank: 0,
            memory: Box::new([0x00; 2 * VRAM_SIZE]),
            tiles: Box::new([Tile::new(); 2 * TILES_COUNT]),
        }
    }

    fn get_tile_address(
        &self,
        tile_data: TileData,
        tile_number: usize,
        tile_row: usize,
        attributes: &TileAttributes,
    ) -> usize {
        // 2x = 2 bytes per line
        let line_base = if attributes.is_y_flipped {
            (7 - tile_row) * 2
        } else {
            tile_row * 2
        };

        let line_offset = match tile_data {
            TileData::Low => line_base,
            TileData::High => line_base + 1,
        };

        let tile_mask = tile_number << 4;
        let address = tile_mask + line_offset;

        let offset = attributes.bank_number as usize * VRAM_SIZE;
        address + offset
    }

    pub fn get_tile_low(
        &self,
        tile_number: usize,
        tile_row: usize,
        attributes: &TileAttributes,
    ) -> u8 {
        let address = self.get_tile_address(TileData::Low, tile_number, tile_row, attributes);
        let data = self.memory[address];

        if attributes.is_x_flipped {
            data.reverse_bits()
        } else {
            data
        }
    }

    pub fn get_tile_high(
        &self,
        tile_number: usize,
        tile_row: usize,
        attributes: &TileAttributes,
    ) -> u8 {
        let address = self.get_tile_address(TileData::High, tile_number, tile_row, attributes);
        let data = self.memory[address];

        if attributes.is_x_flipped {
            data.reverse_bits()
        } else {
            data
        }
    }

    pub fn get_tile_attributes(&self, tile_address: u16) -> TileAttributes {
        let bits = self.memory[tile_address as usize + VRAM_SIZE];
        TileAttributes::from_bits(bits)
    }

    // TODO used only for the sprites, remove eventually
    pub fn get_tile(&self, tile_number: usize, bank: u8) -> &Tile {
        &self.tiles[tile_number + (bank as usize) * TILES_COUNT]
    }

    // TODO remove with sprite fetcher eventually
    fn update_tile(&mut self, address: u16) {
        // TODO this should be removed
        // Fetcher shouldn't use this - it's not accurate (tile can be changed between fetching high & low)
        // move this logic somewhere to debugger UI

        let local_address = (address & DATA_MASK) as usize;

        // 16 bytes per tile + bank offset
        let index = (local_address >> 4) + (TILES_COUNT * self.bank as usize);

        // 2 bytes per line
        let row = local_address >> 1 & 7;

        // always recompute with odd line as the base line, ignore first bit
        let base_address = (local_address + (self.bank as usize) * VRAM_SIZE) & 0xfffe;
        let tile_data_low = self.memory[base_address];
        let tile_data_high = self.memory[base_address + 1];

        for x in 0..TILE_SIZE {
            let high = get_bit(tile_data_high, x);
            let low = get_bit(tile_data_low, x);
            let pixel = (high << 1) | low;

            self.tiles[index].data[row][x] = pixel;
        }
        self.tiles[index].data[row].reverse();
    }

    pub fn get_tiles(&self) -> &[Tile] {
        &self.tiles
    }

    pub fn get_tiles_hash(&self) -> u64 {
        calculate_hash(&self.tiles)
    }
}

fn get_address(address: u16, bank: u8) -> usize {
    // 0x8001 -> 0x0001
    let offset = (address & DATA_MASK) as usize;
    let bank_offset = (bank as usize) * VRAM_SIZE;
    offset + bank_offset
}

impl MemoryAccess for Vram {
    fn read_byte(&self, address: u16) -> u8 {
        if address == R_VBK {
            return self.bank | 0b1111_1110;
        }
        self.memory[get_address(address, self.bank)]
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        if address == R_VBK {
            self.bank = value & 1;
            return;
        }

        // Tiles            0x8000 -> 0x97ff - store + transform pixels
        // Background maps  0x9800 -> 0x9fff - just store
        self.memory[get_address(address, self.bank)] = value;

        if (0x8000..=0x97ff).contains(&address) {
            self.update_tile(address);
        }
    }
}
