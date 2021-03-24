use std::{
    collections::hash_map::DefaultHasher,
    fmt::Display,
    hash::{Hash, Hasher},
    usize,
};

use crate::constants::TILE_SIZE;
use crate::traits::MemoryAccess;

pub const VRAM_START: u16 = 0x8000;
pub const VRAM_END: u16 = 0x9fff;
const TILES_COUNT: usize = 384;
// 8x8 pixels, 384 tiles, 0x8000 -> 0x97ff

const DATA_MASK: u16 = 0x1fff;

const VRAM_SIZE: usize = VRAM_END as usize - VRAM_START as usize + 1;

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
    pub memory: Box<[u8; VRAM_SIZE]>,
    pub tiles: Box<[Tile; TILES_COUNT]>,
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

impl Vram {
    pub fn new() -> Vram {
        Vram {
            memory: Box::new([0x00; VRAM_SIZE]),
            tiles: Box::new([Tile::new(); TILES_COUNT]),
        }
    }

    fn update_tile(&mut self, address: usize) {
        // 16 bytes per tile
        let index = address >> 4;

        // 2 bytes per line
        let row = address >> 1 & 7;

        // always recompute with odd line as the base line, ignore first bit
        let base_address = address & 0xfffe;
        let tile_data_low = self.memory[base_address];
        let tile_data_high = self.memory[base_address + 1];

        for x in 0..TILE_SIZE {
            let high = get_bit(tile_data_high, x);
            let low = get_bit(tile_data_low, x);
            let pixel = (high << 1) | low;

            self.tiles[index].data[row][x as usize] = pixel;
        }
        self.tiles[index].data[row].reverse();
        // debug!("Tile @ {} {}", address, self.tiles[index]);
    }

    pub fn get_tiles(&self) -> &[Tile; TILES_COUNT] {
        &self.tiles
    }

    pub fn get_tiles_hash(&self) -> u64 {
        calculate_hash(&self.tiles)
    }

    pub fn get_tile_at(&self, tile_number: usize) -> &Tile {
        &self.tiles[tile_number]
    }
}

fn get_address(address: u16) -> usize {
    // 0x8001 -> 0x0001
    (address & DATA_MASK) as usize
}

impl MemoryAccess for Vram {
    fn read_byte(&self, address: u16) -> u8 {
        self.memory[get_address(address)]
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        // Tiles            0x8000 -> 0x97ff - store + transform pixels
        // Background maps  0x9800 -> 0x9fff - just store
        let addr = get_address(address);

        self.memory[addr] = value;

        if (0x8000..=0x97ff).contains(&address) {
            self.update_tile(addr);
        }
    }
}
