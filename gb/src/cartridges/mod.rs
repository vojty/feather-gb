use self::cartridge::Data;

pub mod cartridge;
mod mbc1;
mod mbc2;
mod mbc3;
mod mbc5;
mod rom_only;

const ROM_BANK_SIZE: usize = 0x4000; // 16 kb
const RAM_BANK_SIZE: usize = 0x2000; // 8 kb

trait Controller {
    fn read_byte(&self, address: u16) -> u8;
    fn write_byte(&mut self, address: u16, value: u8);
}
