use super::{Controller, Data};
use crate::utils::get_invalid_address;
pub struct Mbc3 {
    data: Data,
    romb: u8,
    ramb: u8,
    ramg: bool,
}

impl Mbc3 {
    pub fn new(data: Data) -> Self {
        Self {
            data,
            ramg: false,
            ramb: 0x00,
            romb: 0x01,
        }
    }
}

impl Controller for Mbc3 {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            // ROM Bank 00
            0x0000..=0x3fff => self.data.read_rom(address as usize),
            // ROM Bank 01-1FF
            0x4000..=0x7fff => {
                let addr = self.data.get_rom_address(address, self.romb as usize);
                self.data.read_rom(addr)
            }
            // A000-BFFF - RAM Bank 00-03, if any (Read/Write)
            // A000-BFFF - RTC Register 08-0C (Read/Write)
            0xa000..=0xbfff => {
                if !self.ramg {
                    return 0xff;
                }
                match address {
                    0x00..=0x03 => {
                        let addr = self.data.get_ram_address(address, self.ramb as usize);
                        self.data.read_ram(addr)
                    }
                    _ => 0xff,
                }
            }
            _ => panic!(get_invalid_address("MBC3 (read)", address)),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            // 0000-1FFF - RAM and Timer Enable (Write Only)
            0x0000..=0x1fff => {
                self.ramg = value & 0xa == 0xa;
            }
            // 2000-3FFF - ROM Bank Number (Write Only)
            0x2000..=0x3fff => {
                self.romb = if value == 0 { 1 } else { value };
            }
            // 4000-5FFF - RAM Bank Number - or - RTC Register Select (Write Only)
            0x4000..=0x5fff => {
                self.ramb = value & 0xf;
            }
            // 6000-7FFF - Latch Clock Data (Write Only)
            0x6000..=0x7fff => {
                // TODO
            }
            // A000-BFFF - RAM Bank 00-03, if any (Read/Write)
            // A000-BFFF - RTC Register 08-0C (Read/Write)
            0xa000..=0xbfff => {
                // TODO check this
                if !self.ramg {
                    return;
                }
                match self.ramb {
                    0x00..=0x03 => {
                        let addr = self.data.get_ram_address(address, self.ramb as usize);
                        self.data.write_ram(addr, value);
                    }
                    _ => (),
                }
            }
            _ => panic!(get_invalid_address("MBC3 (write)", address)),
        }
    }
}
