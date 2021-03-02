use crate::{
    interrupts::{InterruptBits, InterruptController},
    utils::get_invalid_address,
};

const R_JOYP: u16 = 0xff00;
const JOYP_UNUSED_MASK: u8 = 0b1100_0000;

pub struct Joypad {
    selected_column: u8,
    arrows_bits: u8,
    buttons_bits: u8,
}

pub enum ArrowKey {
    LEFT,
    RIGHT,
    UP,
    DOWN,
}

pub enum ButtonKey {
    A,
    B,
    SELECT,
    START,
}

pub enum KeyType {
    Button,
    Arrow,
}

pub trait Key {
    fn get_bit(&self) -> u8;
    fn get_type(&self) -> KeyType;
}

impl Key for ArrowKey {
    fn get_type(&self) -> KeyType {
        KeyType::Arrow
    }

    fn get_bit(&self) -> u8 {
        match self {
            ArrowKey::RIGHT => 0b0000_0001,
            ArrowKey::LEFT => 0b0000_0010,
            ArrowKey::UP => 0b0000_0100,
            ArrowKey::DOWN => 0b0000_1000,
        }
    }
}

impl Key for ButtonKey {
    fn get_type(&self) -> KeyType {
        KeyType::Button
    }

    fn get_bit(&self) -> u8 {
        match self {
            ButtonKey::A => 0b0000_0001,
            ButtonKey::B => 0b0000_0010,
            ButtonKey::SELECT => 0b0000_0100,
            ButtonKey::START => 0b0000_1000,
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

    pub fn on_key_up<K: Key>(&mut self, key: K, ic: &mut InterruptController) {
        match key.get_type() {
            KeyType::Button => self.buttons_bits |= key.get_bit(),
            KeyType::Arrow => self.arrows_bits |= key.get_bit(),
        }
        ic.request_interrupt(InterruptBits::JOYPAD)
    }

    pub fn on_key_down<K: Key>(&mut self, key: K, ic: &mut InterruptController) {
        match key.get_type() {
            KeyType::Button => self.buttons_bits &= !key.get_bit(),
            KeyType::Arrow => self.arrows_bits &= !key.get_bit(),
        }
        ic.request_interrupt(InterruptBits::JOYPAD)
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        if address != R_JOYP {
            panic!(get_invalid_address("Joypad", address));
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
            panic!(get_invalid_address("Joypad", address));
        }

        self.selected_column = (value & 0b0011_0000) >> 4
    }
}
