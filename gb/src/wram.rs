use std::cmp::max;

use crate::utils::invalid_address;

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
    is_cgb: bool,
}

impl Wram {
    pub fn new(is_cgb: bool) -> Self {
        Self {
            is_cgb,
            bank: 1,
            data: Box::new([0xff; WRAM_SIZE]),
        }
    }

    fn get_offset(&self, address: u16) -> usize {
        let base = (address & 0x1fff) as usize;
        match address {
            0xC000..=0xCFFF => base,
            0xD000..=0xDFFF => base + (self.bank as usize) * BANK_SIZE,
            _ => invalid_address("WRAM", address),
        }
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_SVBK => {
                if self.is_cgb {
                    return self.bank | 0b1111_1100;
                }
                0xff
            }
            WRAM_START..=WRAM_END => self.data[self.get_offset(address)],
            _ => invalid_address("WRAM (read)", address),
        }
    }

    pub fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            R_SVBK => {
                if self.is_cgb {
                    let bank = value & 0b11;
                    self.bank = max(bank, 1);
                }
            }
            WRAM_START..=WRAM_END => self.data[self.get_offset(address)] = value,
            _ => invalid_address("WRAM (write)", address),
        }
    }
}
