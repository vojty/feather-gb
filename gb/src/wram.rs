use std::cmp::max;

use crate::utils::get_invalid_address;

const WRAM_START: u16 = 0xc000;
const WRAM_END: u16 = 0xdfff;

const BANK_SIZE: usize = 4096;
const WRAM_SIZE: usize = 8 * BANK_SIZE;

const R_SVBK: u16 = 0xff70;

// DMG: bank 0        0xC000 - 0xCFFF
//      bank 1        0xD000 - 0xDFFF
// CGB: bank 0        0xC000 - 0xCFFF
//      bank 1-7      0xD000 - 0xDFFF

pub struct Wram {
    data: Box<[u8; WRAM_SIZE]>,
    bank: u8,
}

impl Wram {
    pub fn new() -> Self {
        Self {
            bank: 1,
            data: Box::new([0xff; WRAM_SIZE]),
        }
    }

    fn get_offset(&self, address: u16) -> usize {
        let base = (address & 0x1fff) as usize;
        match address {
            0xC000..=0xCFFF => base,
            0xD000..=0xDFFF => base + (self.bank as usize) * BANK_SIZE,
            _ => panic!(get_invalid_address("WRAM ", address)),
        }
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_SVBK => self.bank | 0b1111_1100,
            WRAM_START..=WRAM_END => self.data[self.get_offset(address)],
            _ => panic!(get_invalid_address("WRAM (read)", address)),
        }
    }

    pub fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            R_SVBK => {
                let bank = value & 0b11;
                self.bank = max(bank, 1);
            }
            WRAM_START..=WRAM_END => self.data[self.get_offset(address)] = value,
            _ => panic!(get_invalid_address("WRAM (read)", address)),
        }
    }
}
