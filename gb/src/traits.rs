pub trait MemoryAccess {
    fn read_byte(&self, address: u16) -> u8;
    fn write_byte(&mut self, address: u16, value: u8);
}

pub trait DisplayHex {
    fn to_hex(&self) -> String;
}
