use std::{
    collections::hash_map::DefaultHasher,
    fmt::Display,
    hash::{Hash, Hasher},
    usize,
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

#[derive(Clone, Copy, Hash)]
pub struct TileAttributes {
    // Bit 7    BG-to-OAM Priority         (0=Use OAM Priority bit, 1=BG Priority)
    // Bit 6    Vertical Flip              (0=Normal, 1=Mirror vertically)
    // Bit 5    Horizontal Flip            (0=Normal, 1=Mirror horizontally)
    // Bit 4    Not used
    // Bit 3    Tile VRAM Bank number      (0=Bank 0, 1=Bank 1)
    // Bit 2-0  Background Palette number  (BGP0-7)
    pub bank_number: u8,
}

impl TileAttributes {
    pub fn new() -> Self {
        Self { bank_number: 0 }
    }

    pub fn from_bits(bits: u8) -> Self {
        let bank_number = (bits & 0b0000_1000) >> 3;
        Self { bank_number }
    }
}

#[derive(Clone, Copy, Hash)]
pub struct Tile {
    pub data: [[u8; 8]; 8],
}

impl Display for Tile {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut str = String::new();
        for y in 0..TILE_SIZE {
            let row = self.data[y];

            let a = row
                .iter()
                .map(|item| format!("{:02x}", item))
                .collect::<Vec<String>>()
                .join(" ");

            str.push_str(&a);
            str.push('\n');
        }

        write!(f, "\n{}", str)
    }
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
        y: usize,
        bank: u8,
    ) -> usize {
        let line = match tile_data {
            TileData::Low => (y % 8) * 2,
            TileData::High => (y % 8) * 2 + 1,
        };
        let tile_mask = tile_number << 4;
        let address = tile_mask | line;
        if bank == 0 {
            return address;
        }
        address + VRAM_SIZE
    }

    pub fn get_tile_low(&self, tile_number: usize, y: usize, bank: u8) -> u8 {
        let address = self.get_tile_address(TileData::Low, tile_number, y, bank);
        self.memory[address]
    }

    pub fn get_tile_high(&self, tile_number: usize, y: usize, bank: u8) -> u8 {
        let address = self.get_tile_address(TileData::High, tile_number, y, bank);
        self.memory[address]
    }

    // TODO used only for the sprites, remove eventually
    pub fn get_tile(&self, tile_number: usize, bank: u8) -> &Tile {
        &self.tiles[tile_number + (bank as usize) * TILES_COUNT]
    }

    pub fn get_tile_attributes(&self, tile_address: u16) -> TileAttributes {
        let bits = self.memory[tile_address as usize + VRAM_SIZE];
        TileAttributes::from_bits(bits)
    }

    fn update_tile(&mut self, address: u16) {
        // TODO this should be removed
        // Fetcher shouldn't use this - it's not accurate (tile can be changed between fetching high & low)
        // move this logic somewhere to debugger UI

        let local_address = (address & DATA_MASK) as usize;

        // 16 bytes per tile + bank offset
        let index = (local_address >> 4) + (TILES_COUNT * self.bank as usize);

        // 2 bytes per line
        let row = (local_address >> 1 & 7) as usize;

        // always recompute with odd line as the base line, ignore first bit
        let base_address = (local_address + (self.bank as usize) * VRAM_SIZE) & 0xfffe;
        let tile_data_low = self.memory[base_address];
        let tile_data_high = self.memory[base_address + 1];

        for x in 0..TILE_SIZE {
            let high = get_bit(tile_data_high, x);
            let low = get_bit(tile_data_low, x);
            let pixel = (high << 1) | low;

            self.tiles[index].data[row][x as usize] = pixel;
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
