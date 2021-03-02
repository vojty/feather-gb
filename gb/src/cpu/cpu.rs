use std::fmt::Formatter;

use bitflags::bitflags;
use parse_display::{Display, FromStr};

use crate::{
    emulator::{Hardware, SplitU16},
    traits::MemoryAccess,
};

bitflags!(
    pub struct Flags: u8 {
      const Z = 0b_1000_0000;
      const N = 0b_0100_0000;
      const H = 0b_0010_0000;
      const C = 0b_0001_0000;
    }
);

impl std::fmt::Display for Flags {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let z = if self.contains(Flags::Z) { "Z" } else { "_" };
        let n = if self.contains(Flags::N) { "N" } else { "_" };
        let h = if self.contains(Flags::H) { "H" } else { "_" };
        let c = if self.contains(Flags::C) { "C" } else { "_" };
        write!(f, "{}{}{}{}", z, n, h, c)
    }
}

impl Flags {
    pub fn clear(&mut self) {
        self.bits = 0;
    }
}

#[derive(Clone, Copy, Display, FromStr)]
pub enum Reg8 {
    A,

    B,
    C,

    D,
    E,

    H,
    L,
}

#[derive(Clone, Copy, Display, FromStr)]
pub enum Reg16 {
    AF,
    BC,
    DE,
    HL,

    SP,
}

pub struct Cpu {
    pub frame_cycles: u32,
    pub total_cycles: u32,

    pub halted: bool,
    pub halt_bug: bool,
    pub just_halted: bool,

    pub ime: bool,
    pub ime_requested: bool,

    pub pc: u16,
    pub sp: u16,

    pub a: u8,
    pub f: Flags,

    pub b: u8,
    pub c: u8,

    pub d: u8,
    pub e: u8,

    pub h: u8,
    pub l: u8,
}

impl Cpu {
    pub fn new() -> Cpu {
        Cpu {
            pc: 0x0000,
            sp: 0x0000,

            a: 0x00,
            f: Flags::empty(),

            b: 0x00,
            c: 0x00,

            d: 0x00,
            e: 0x00,

            h: 0x00,
            l: 0x00,

            ime: false,
            halted: false,
            halt_bug: false,
            just_halted: false,
            ime_requested: false,

            frame_cycles: 0,
            total_cycles: 0,
        }
    }

    pub fn read_reg8(&self, register: Reg8) -> u8 {
        match register {
            Reg8::A => self.a,
            Reg8::B => self.b,
            Reg8::C => self.c,
            Reg8::D => self.d,
            Reg8::E => self.e,
            Reg8::H => self.h,
            Reg8::L => self.l,
        }
    }

    pub fn write_reg8(&mut self, register: Reg8, value: u8) -> &mut Cpu {
        match register {
            Reg8::A => self.a = value,
            Reg8::B => self.b = value,
            Reg8::C => self.c = value,
            Reg8::D => self.d = value,
            Reg8::E => self.e = value,
            Reg8::H => self.h = value,
            Reg8::L => self.l = value,
        }
        self
    }

    pub fn read_reg16(&mut self, register: Reg16) -> u16 {
        match register {
            Reg16::AF => (self.a as u16) << 8 | self.f.bits() as u16,
            Reg16::BC => (self.b as u16) << 8 | self.c as u16,
            Reg16::DE => (self.d as u16) << 8 | self.e as u16,
            Reg16::HL => (self.h as u16) << 8 | self.l as u16,
            Reg16::SP => self.sp,
        }
    }

    pub fn write_reg16(&mut self, register: Reg16, value: u16) {
        let low = (value & 0xff) as u8;
        let high = (value >> 8) as u8;

        match register {
            Reg16::AF => {
                self.a = high;
                self.f = Flags::from_bits_truncate(low);
            }
            Reg16::BC => {
                self.b = high;
                self.c = low;
            }
            Reg16::DE => {
                self.d = high;
                self.e = low;
            }
            Reg16::HL => {
                self.h = high;
                self.l = low;
            }

            Reg16::SP => self.sp = value,
        }
    }

    pub fn clear_flags(&mut self) {
        self.f.clear();
    }

    pub fn clear_flag(&mut self, flag: Flags) {
        self.f.remove(flag);
    }

    pub fn set_flag(&mut self, flag: Flags) {
        self.f.insert(flag);
    }

    pub fn update_flag(&mut self, flag: Flags, value: bool) -> &mut Cpu {
        if value {
            self.set_flag(flag);
        } else {
            self.clear_flag(flag);
        }
        self
    }

    pub fn get_carry_bit(&mut self) -> u8 {
        if self.f.contains(Flags::C) {
            return 0x01;
        }
        0x00
    }

    pub fn increment_pc(&mut self) {
        self.pc = self.pc.wrapping_add(1)
    }
}

impl Cpu {
    pub fn read_u8_tick(&mut self, hw: &mut Hardware, address: u16) -> u8 {
        let value = hw.read_byte(address);
        self.tick(hw);
        value
    }

    pub fn write_u8_tick(&mut self, hw: &mut Hardware, address: u16, value: u8) {
        hw.write_byte(address, value);
        self.tick(hw)
    }

    pub fn read_imm_u8_tick(&mut self, hw: &mut Hardware) -> u8 {
        let value = self.read_u8_tick(hw, self.pc);
        self.increment_pc();
        value
    }

    pub fn read_imm_u16_tick(&mut self, hw: &mut Hardware) -> u16 {
        let value = self.read_u16_tick(hw, self.pc);
        self.increment_pc();
        self.increment_pc();
        value
    }

    pub fn read_u16_tick(&mut self, hw: &mut Hardware, address: u16) -> u16 {
        let lower = self.read_u8_tick(hw, address) as u16;
        let upper = (self.read_u8_tick(hw, address + 1) as u16) << 8;
        lower | upper
    }

    pub fn write_u16_tick(&mut self, hw: &mut Hardware, address: u16, value: u16) {
        let (high, low) = value.split_to_u8();
        self.write_u8_tick(hw, address + 1, high);
        self.write_u8_tick(hw, address, low)
    }

    pub fn tick(&mut self, hw: &mut Hardware) {
        // Step
        let cycles = 4;

        // TODO refactor
        // DMA takes 460 cycles / 40 sprites -> 16 cycles/sprite
        // sprite = 4 bytes = 16 cycles -> 4 cycles per byte
        let oam_step = hw.oam_dma.tick();
        if let Some((source, target)) = oam_step {
            let byte = hw.read_byte(source);
            hw.ppu.oam.write_byte(target, byte)
        }

        // When drawing only background it generates 8 pixels every 8 cycles into the upper part of the FIFO
        // and then shifts them down over the next 8 cycles ready for the next 8 pixels to be written
        for _ in 0..cycles {
            hw.ppu.tick(&mut hw.interrupts);
            hw.timer.tick(&mut hw.interrupts);
        }

        self.frame_cycles += cycles;
        self.total_cycles = self.total_cycles.wrapping_add(cycles);
    }
}
