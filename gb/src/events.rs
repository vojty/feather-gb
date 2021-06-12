use bitflags::bitflags;

bitflags! {
    pub struct Events: u8 {
        const V_BLANK          = 0b0000_0001;
        const MAGIC_BREAKPOINT = 0b0000_0010; // LD B,B for tests
    }
}
