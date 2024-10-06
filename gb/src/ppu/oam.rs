use crate::{constants::SPRITES_COUNT, traits::MemoryAccess, utils::invalid_address};
pub const OAM_START: u16 = 0xfe00;
pub const OAM_END: u16 = 0xfe9f;

const DATA_MASK: u16 = 0xff;

const OAM_SIZE: usize = OAM_END as usize - OAM_START as usize + 1;

#[derive(Clone, Copy, Hash)]
pub struct Sprite {
    pub x: isize,
    pub y: isize,
    pub tile_number: usize,
    pub is_above_bg: bool,
    pub is_y_flipped: bool,
    pub is_x_flipped: bool,
    pub palette: usize,
    pub cgb_palette: usize,
    pub tile_vram_bank: u8,
}

impl Sprite {
    fn new() -> Sprite {
        Sprite {
            x: 0,
            y: 0,
            tile_number: 0,
            is_above_bg: false,
            is_y_flipped: false,
            is_x_flipped: false,
            palette: 0,
            cgb_palette: 0,
            tile_vram_bank: 0,
        }
    }
}

pub struct Oam {
    memory: Box<[u8; OAM_SIZE]>,
    pub sprites: Box<[Sprite; SPRITES_COUNT]>,
}

impl Oam {
    pub fn new() -> Oam {
        Oam {
            memory: Box::new([0; OAM_SIZE]),
            sprites: Box::new([Sprite::new(); SPRITES_COUNT]),
        }
    }

    fn update_sprite(&mut self, address: usize, value: u8) {
        let index = address >> 2; // 4 bytes per sprite
        if index >= SPRITES_COUNT {
            invalid_address("OAM (write)", address as u16);
        }

        let value = value as usize;

        let sprite = &mut self.sprites[index];

        match address & 0b11 {
            0 => sprite.y = value as isize - 16,
            1 => sprite.x = value as isize - 8,
            2 => sprite.tile_number = value,
            3 => {
                sprite.cgb_palette = value & 0b111;
                sprite.palette = usize::from(value & 0x10 > 0);
                sprite.is_x_flipped = value & 0x20 > 0;
                sprite.is_y_flipped = value & 0x40 > 0;
                sprite.is_above_bg = value & 0x80 == 0;
                sprite.tile_vram_bank = ((value & 0b0000_1000) >> 3) as u8;
            }
            _ => invalid_address("OAM (write)", address as u16),
        }
    }
}

fn get_address(address: u16) -> usize {
    // 0xfe01 -> 0x0001
    (address & DATA_MASK) as usize
}

impl MemoryAccess for Oam {
    fn read_byte(&self, address: u16) -> u8 {
        self.memory[get_address(address)]
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        let addr = get_address(address);

        self.memory[addr] = value;
        self.update_sprite(addr, value);
    }
}
