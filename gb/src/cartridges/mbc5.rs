use super::{Controller, Data};
use crate::utils::invalid_address;
pub struct Mbc5 {
    data: Data,
    romb0: u8,
    romb1: u8,
    ramb: u8,
    ramg: bool,
}

impl Mbc5 {
    pub fn new(data: Data) -> Self {
        Self {
            data,
            ramg: false,
            romb0: 0x01,
            romb1: 0x00,
            ramb: 0x00,
        }
    }
}

impl Controller for Mbc5 {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            // 0000-3FFF - ROM Bank 00 (Read Only)
            0x0000..=0x3fff => self.data.read_rom(address as usize), // always bank 0 - no offset here
            // 4000-7FFF - ROM Bank 01-1FF (Read Only)
            0x4000..=0x7fff => {
                let bank = self.romb0 as usize | ((self.romb1 as usize) << 8);
                let addr = self.data.get_rom_address(address, bank);
                self.data.read_rom(addr)
            }
            // A000-BFFF - RAM Bank 00-03, if any (Read/Write)
            0xa000..=0xbfff => {
                if !self.ramg || self.data.get_ram_size() == 0 {
                    return 0xff;
                }
                let addr = self.data.get_ram_address(address, self.ramb as usize);
                self.data.read_ram(addr)
            }
            _ => invalid_address("MBC5 (read)", address),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            // 0000-1FFF - RAM Enable (Write Only)
            0x0000..=0x1fff => {
                self.ramg = value == 0x0a;
            }
            // 2000-2FFF - Low 8 bits of ROM Bank Number (Write Only)
            0x2000..=0x2fff => {
                self.romb0 = value;
            }
            // 3000-3FFF - High bit of ROM Bank Number (Write Only)
            0x3000..=0x3fff => {
                self.romb1 = value & 0b1;
            }
            // 4000-5FFF - RAM Bank Number (Write Only)
            0x4000..=0x5fff => self.ramb = value & 0b1111,
            0x6000..=0x7fff => (), // no-op
            0xa000..=0xbfff => {
                if !self.ramg || self.data.get_ram_size() == 0 {
                    return;
                }
                let addr = self.data.get_ram_address(address, self.ramb as usize);
                self.data.write_ram(addr, value);
            }
            _ => invalid_address("MBC5 (write)", address),
        }
    }
}
