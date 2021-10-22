use crate::traits::DisplayHex;

// {:02x}
// : - special formatting
// 02 - prepend 0 to max 2 chars
// x - hex small (X - bigger hex)

impl DisplayHex for usize {
    fn to_hex(&self) -> String {
        if self > &0xff_usize {
            format!("{:04x}", self)
        } else {
            format!("{:02x}", self)
        }
    }
}

impl DisplayHex for u16 {
    fn to_hex(&self) -> String {
        format!("{:04x}", self)
    }
}

impl DisplayHex for u8 {
    fn to_hex(&self) -> String {
        format!("{:02x}", self)
    }
}

pub fn invalid_address(section: &str, address: u16) -> ! {
    panic!("Unmapped address 0x{} at {}", address.to_hex(), section)
}