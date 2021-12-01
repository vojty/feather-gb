use crate::{traits::MemoryAccess, utils::invalid_address};

pub struct Serial {
    sb: u8,
    sc: u8,
}

const R_SB: u16 = 0xff01;
const R_SC: u16 = 0xff02;

impl Serial {
    pub fn new() -> Self {
        Self { sb: 0x00, sc: 0xff }
    }
}

impl MemoryAccess for Serial {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_SB => self.sb,
            R_SC => 0b0111_1110,
            _ => invalid_address("Serial (read)", address),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            R_SB => self.sb = value,
            R_SC => self.sc = value,
            _ => invalid_address("Serial (write)", address),
        };
    }
}
