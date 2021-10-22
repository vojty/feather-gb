use crate::{
    interrupts::{InterruptBits, InterruptController},
    utils::invalid_address,
};

const R_JOYP: u16 = 0xff00;
const JOYP_UNUSED_MASK: u8 = 0b1100_0000;

pub struct Joypad {
    selected_column: u8,
    arrows_bits: u8,
    buttons_bits: u8,
}

pub enum JoypadKey {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    A,
    B,
    Start,
    Select,
}

enum KeyType {
    Arrow,
    Button,
}

impl JoypadKey {
    fn get_bit(&self) -> u8 {
        match self {
            JoypadKey::ArrowRight => 0b0000_0001,
            JoypadKey::ArrowLeft => 0b0000_0010,
            JoypadKey::ArrowUp => 0b0000_0100,
            JoypadKey::ArrowDown => 0b0000_1000,

            JoypadKey::A => 0b0000_0001,
            JoypadKey::B => 0b0000_0010,
            JoypadKey::Select => 0b0000_0100,
            JoypadKey::Start => 0b0000_1000,
        }
    }

    fn get_type(&self) -> KeyType {
        match self {
            JoypadKey::ArrowRight
            | JoypadKey::ArrowLeft
            | JoypadKey::ArrowUp
            | JoypadKey::ArrowDown => KeyType::Arrow,

            JoypadKey::A | JoypadKey::B | JoypadKey::Select | JoypadKey::Start => KeyType::Button,
        }
    }
}

impl Joypad {
    pub fn new() -> Self {
        Self {
            selected_column: 0b11,
            arrows_bits: 0b1111,
            buttons_bits: 0b1111,
        }
    }

    pub fn on_key_up(&mut self, key: JoypadKey, ic: &mut InterruptController) {
        match key.get_type() {
            KeyType::Button => self.buttons_bits |= key.get_bit(),
            KeyType::Arrow => self.arrows_bits |= key.get_bit(),
        }
        ic.request_interrupt(InterruptBits::JOYPAD)
    }

    pub fn on_key_down(&mut self, key: JoypadKey, ic: &mut InterruptController) {
        match key.get_type() {
            KeyType::Button => self.buttons_bits &= !key.get_bit(),
            KeyType::Arrow => self.arrows_bits &= !key.get_bit(),
        }
        ic.request_interrupt(InterruptBits::JOYPAD)
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        if address != R_JOYP {
            invalid_address("Joypad", address);
        }

        if self.selected_column & 0b01 > 0 {
            return self.buttons_bits | JOYP_UNUSED_MASK;
        }

        if self.selected_column & 0b10 > 0 {
            return self.arrows_bits | JOYP_UNUSED_MASK;
        }

        0xff
    }

    pub fn write_byte(&mut self, address: u16, value: u8) {
        if address != R_JOYP {
            invalid_address("Joypad", address);
        }

        self.selected_column = (value & 0b0011_0000) >> 4
    }
}
