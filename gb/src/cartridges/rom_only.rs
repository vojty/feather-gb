use super::{cartridge::Data, Controller};

pub struct RomOnly {
    data: Data,
}

impl RomOnly {
    pub fn new(data: Data) -> RomOnly {
        RomOnly { data }
    }
}

impl Controller for RomOnly {
    fn read_byte(&self, address: u16) -> u8 {
        self.data.read_rom(address as usize)
    }

    fn write_byte(&mut self, _address: u16, _value: u8) {
        // no-op
    }
}
