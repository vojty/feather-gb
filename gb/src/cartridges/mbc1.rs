use super::{cartridge::Data, Controller};
use crate::utils::invalid_address;
enum Mode {
    RomBanking,
    RamBanking,
}
pub struct Mbc1 {
    data: Data,

    bank1: u8,
    bank2: u8,
    mode: Mode,
    ramg: bool,
}

impl Mbc1 {
    pub fn new(data: Data) -> Mbc1 {
        Mbc1 {
            data,
            ramg: false,
            bank1: 0b0_0001,
            bank2: 0b00,
            mode: Mode::RomBanking,
        }
    }

    fn get_lower_rom_bank(&self) -> usize {
        match self.mode {
            Mode::RomBanking => 0,
            Mode::RamBanking => (self.bank2 << 5) as usize,
        }
    }

    fn get_upper_rom_bank(&self) -> usize {
        (self.bank1 | self.bank2 << 5) as usize
    }

    fn get_ram_bank(&self) -> usize {
        match self.mode {
            Mode::RomBanking => 0,
            Mode::RamBanking => self.bank2 as usize,
        }
    }
}

impl Controller for Mbc1 {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            // ROM Bank 00
            0x0000..=0x3fff => {
                let bank = self.get_lower_rom_bank();
                let addr = self.data.get_rom_address(address, bank);
                self.data.read_rom(addr)
            }
            // ROM Bank 01-07
            0x4000..=0x7fff => {
                let bank = self.get_upper_rom_bank();
                let addr = self.data.get_rom_address(address, bank);
                self.data.read_rom(addr)
            }
            // RAM Bank 00-03
            0xa000..=0xbfff => {
                if self.data.get_ram_size() == 0 || !self.ramg {
                    return 0xff;
                }
                let bank = self.get_ram_bank();
                let addr = self.data.get_ram_address(address, bank);
                self.data.read_ram(addr)
            }
            _ => invalid_address("MBC1 (read)", address),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            // RAM Enable
            0x0000..=0x1fff => self.ramg = (value & 0xf) == 0xa,
            // ROM Bank Number
            0x2000..=0x3fff => {
                // Zero bank is skipped
                let sanitized = value & 0x1f;
                self.bank1 = if sanitized == 0 { 1 } else { sanitized };
            }
            // RAM Bank Number - or - Upper Bits of ROM Bank Number
            0x4000..=0x5fff => {
                let sanitized = value & 0b11;
                self.bank2 = sanitized;
            }
            // ROM/RAM Mode Select
            0x6000..=0x7fff => {
                self.mode = if (value & 1) > 0 {
                    Mode::RamBanking
                } else {
                    Mode::RomBanking
                };
            }
            // RAM Bank 00-03, if any
            0xa000..=0xbfff => {
                if self.data.get_ram_size() == 0 || !self.ramg {
                    return;
                }
                let bank = self.get_ram_bank();
                let addr = self.data.get_ram_address(address, bank);
                self.data.write_ram(addr, value);
            }
            _ => invalid_address("MBC1 (write)", address),
        }
    }
}
