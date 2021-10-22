use super::{Controller, Data};
use crate::utils::invalid_address;
pub struct Mbc2 {
    data: Data,
    romb: u8,
    ramg: bool,
}

impl Mbc2 {
    pub fn new(data: Data) -> Mbc2 {
        Mbc2 {
            data,
            romb: 0x01,
            ramg: false,
        }
    }
}

impl Controller for Mbc2 {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            // ROM Bank 00
            0x0000..=0x3fff => self.data.read_rom(address as usize),
            // ROM Bank 01-0F
            0x4000..=0x7fff => {
                let addr = self.data.get_rom_address(address, self.romb as usize);
                self.data.read_rom(addr)
            }
            // 512x4bits RAM, built-in into the MBC2 chip
            0xa000..=0xbfff => {
                if self.ramg {
                    let addr = self.data.get_ram_address(address, 0);
                    return self.data.read_ram(addr) | 0xf0; // top bits are always 1
                }
                0xff
            }
            _ => invalid_address("MBC2 (read)", address),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            // ROM Bank 00
            0x0000..=0x3fff => {
                // 8. bit of address decides what to do
                if address & 0b1_0000_0000 > 0 {
                    // romb handler
                    let possible_bank = value & 0xf;
                    self.romb = if possible_bank == 0 {
                        0x01
                    } else {
                        possible_bank
                    };
                } else {
                    // ramg handler
                    self.ramg = (value & 0xf) == 0xa;
                }
            }
            // ROM Bank 01-0F
            0x4000..=0x7fff => {
                // no-op
            }
            // 512x4bits RAM, built-in into the MBC2 chip
            0xa000..=0xbfff => {
                if self.ramg {
                    let addr = self.data.get_ram_address(address, 0);
                    let value = value & 0xf;
                    self.data.write_ram(addr, value);
                }
            }
            _ => invalid_address("MBC2 (write)", address),
        }
    }
}
