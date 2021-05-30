use crate::utils::get_invalid_address;

pub const R_HDMA1: u16 = 0xff51;
pub const R_HDMA2: u16 = 0xff52;
pub const R_HDMA3: u16 = 0xff53;
pub const R_HDMA4: u16 = 0xff54;
pub const R_HDMA5: u16 = 0xff55;

enum TransferMode {
    GeneralDMA,
    HblankDMA,
}

impl TransferMode {
    fn from_bits(bits: u8) -> TransferMode {
        if bits & 0b1000_0000 > 0 {
            TransferMode::HblankDMA
        } else {
            TransferMode::GeneralDMA
        }
    }
}
pub struct Hdma {
    source: u16,
    destination: u16,
    mode: TransferMode,
}

impl Hdma {
    pub fn new() -> Self {
        Self {
            source: 0,
            destination: 0,
            mode: TransferMode::GeneralDMA,
        }
    }

    pub fn tick(&mut self) -> Option<(u16, u16)> {
        // TODO
        None
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_HDMA1 | R_HDMA2 | R_HDMA3 | R_HDMA4 | R_HDMA5 => 0xff,
            _ => panic!(get_invalid_address("HDMA (write)", address)),
        }
    }

    pub fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            R_HDMA1 => self.source = (self.source & 0x00ff) | ((value as u16) << 8), // upper bits of address
            R_HDMA2 => self.source = (self.source & 0xff00) | ((value as u16) & 0xf0), // lower bits of address (lower 4 are always ignored)
            R_HDMA3 => self.destination = (self.destination & 0x00ff) | ((value as u16) << 8), // upper bits of address
            R_HDMA4 => self.destination = (self.destination & 0xff00) | ((value as u16) & 0xf0), // lower bits of address (lower 4 are always ignored)
            R_HDMA5 => {
                let mode = TransferMode::from_bits(value);

                self.mode = mode;
            }
            _ => panic!(get_invalid_address("HDMA (write)", address)),
        }
    }
}
