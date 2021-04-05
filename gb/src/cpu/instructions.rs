use std::u16;

use cpu::{Cpu, Flags, Reg16, Reg8};
use parse_display::{Display, FromStr};

use crate::emulator::Hardware;
use crate::traits::DisplayHex;

use super::cpu;

#[derive(Display, FromStr, Copy, Clone, PartialEq)]
#[allow(clippy::clippy::upper_case_acronyms)]
pub enum JumpConditions {
    NZ,
    Z,
    NC,
    C,
    #[display("")]
    NONE, // direct jump
}

#[derive(Display, FromStr, Copy, Clone)]
#[allow(clippy::clippy::upper_case_acronyms)]
#[display("({})")]
pub enum Addr {
    BC,
    DE,
    HL,

    #[display("(HL+)")]
    HLI,
    #[display("(HL-)")]
    HLD,
    #[display("(u16)")]
    U16,
    #[display("(FF00+C)")]
    HighC,
    #[display("(FF00+u8)")]
    HighU8,
}
#[derive(Display, Clone, Copy)]
#[display("u8")]
pub struct ImmediateU8;
#[derive(Display, Clone, Copy)]
#[display("u16")]
pub struct ImmediateU16;

// ALU
impl Cpu {
    /**
     ADD A,n
     Add n to A.

     Use with:
     n = A,B,C,D,E,H,L,(HL),#

     Flags affected:
     Z - Set if result is zero
     N - Reset
     H - Set if carry from bit 3
     C - Set if carry from bit 7
    */
    pub fn add<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let a = self.read_reg8(Reg8::A);
        let (result, overflow) = a.overflowing_add(value);

        let half_carry = (a & 0x0f).checked_add(value | 0xf0).is_none();

        self.update_flag(Flags::C, overflow);
        self.update_flag(Flags::Z, result == 0);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, half_carry);

        self.write_reg8(Reg8::A, result);

        format!("ADD A, {}", source)
    }

    pub fn adc<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let a = self.read_reg8(Reg8::A);
        let carry_value = self.get_carry_bit();

        let result = a.wrapping_add(value).wrapping_add(carry_value);

        self.update_flag(
            Flags::C,
            a as u16 + value as u16 + carry_value as u16 > 0xff,
        );
        self.update_flag(Flags::H, (a & 0xf) + (value & 0xf) + carry_value > 0xf);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::Z, result == 0);

        self.write_reg8(Reg8::A, result);

        format!("ADC A,{}", source)
    }

    fn base_sub(&mut self, value: u8, subtract_carry: bool) -> u8 {
        let a = self.read_reg8(Reg8::A);

        let carry_value = if subtract_carry && self.f.contains(Flags::C) {
            1
        } else {
            0
        };

        let result = a.wrapping_sub(value).wrapping_sub(carry_value);

        self.update_flag(Flags::N, true);
        self.update_flag(Flags::Z, result == 0);
        self.update_flag(
            Flags::C,
            (a as u16) < ((value as u16) + (carry_value as u16)),
        );
        self.update_flag(
            Flags::H,
            (a & 0xf)
                .wrapping_sub(value & 0xf)
                .wrapping_sub(carry_value)
                & (0xf + 1)
                != 0,
        );
        result
    }

    pub fn sub<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = self.base_sub(value, false);
        self.write_reg8(Reg8::A, result);

        format!("SUB A,{}", source)
    }

    pub fn cp<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        self.base_sub(value, false);

        format!("CP A,{}", source)
    }

    pub fn sbc<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = self.base_sub(value, true);
        self.write_reg8(Reg8::A, result);

        format!("SBC A,{}", source)
    }

    pub fn and<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = self.read_reg8(Reg8::A) & value;
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, true);
        self.update_flag(Flags::C, false);
        self.update_flag(Flags::Z, result == 0);

        self.write_reg8(Reg8::A, result);
        format!("AND {}", source)
    }

    pub fn or<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = self.read_reg8(Reg8::A) | value;
        self.clear_flags();
        if result == 0 {
            self.set_flag(Flags::Z);
        }
        self.write_reg8(Reg8::A, result);

        format!("OR {}", source)
    }

    pub fn xor<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = self.read_reg8(Reg8::A) ^ value;
        self.clear_flags();
        if result == 0 {
            self.set_flag(Flags::Z);
        }
        self.write_reg8(Reg8::A, result);

        format!("XOR {}", source)
    }

    pub fn inc<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = value.wrapping_add(1);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::Z, result == 0);
        self.update_flag(Flags::H, value & 0xf == 0xf);

        source.write8(self, hw, result);

        format!("INC {}", source)
    }

    pub fn inc16<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read16 + Write16 + std::fmt::Display + Copy,
    {
        let value = source.read16(self, hw);
        let result = value.wrapping_add(1);
        source.write16(self, hw, result);
        self.tick(hw); // internal

        format!("INC {}", source)
    }

    pub fn dec<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = value.wrapping_sub(1);
        self.update_flag(Flags::N, true);
        self.update_flag(Flags::Z, result == 0);
        self.update_flag(Flags::H, value & 0xf == 0);

        source.write8(self, hw, result);

        format!("DEC {}", source)
    }

    pub fn dec16<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read16 + Write16 + std::fmt::Display + Copy,
    {
        let value = source.read16(self, hw);
        let result = value.wrapping_sub(1);
        source.write16(self, hw, result);
        self.tick(hw); // internal

        format!("DEC {}", source)
    }

    /* Jumps */
    pub fn jp_hl_address(&mut self) -> String {
        let address = self.read_reg16(Reg16::HL);
        self.pc = address;

        "JP HL".to_string()
    }

    pub fn jp_cc_imm_u16(&mut self, hw: &mut Hardware, condition: JumpConditions) -> String {
        let address = self.read_imm_u16_tick(hw);
        let condition_result = match condition {
            JumpConditions::NZ => !self.f.contains(Flags::Z),
            JumpConditions::Z => self.f.contains(Flags::Z),
            JumpConditions::NC => !self.f.contains(Flags::C),
            JumpConditions::C => self.f.contains(Flags::C),
            JumpConditions::NONE => true,
        };

        if condition_result {
            self.pc = address;
            self.tick(hw) // internal
        }

        if condition == JumpConditions::NONE {
            "JP u16".to_string()
        } else {
            format!("JP {},u16", condition)
        }
    }

    pub fn jr_cc(&mut self, hw: &mut Hardware, condition: JumpConditions) -> String {
        let condition_result = match condition {
            JumpConditions::NZ => !self.f.contains(Flags::Z),
            JumpConditions::Z => self.f.contains(Flags::Z),
            JumpConditions::NC => !self.f.contains(Flags::C),
            JumpConditions::C => self.f.contains(Flags::C),
            JumpConditions::NONE => true,
        };

        // Convert to signed value

        let offset = self.read_imm_u8_tick(hw) as i8;
        if condition_result {
            format!("pre PC={}", self.pc);
            self.pc = self.pc.wrapping_add(offset as u16);
            format!("post PC={}", self.pc);
            self.tick(hw) // internal
        } else {
        }

        if condition == JumpConditions::NONE {
            "JR i8".to_string()
        } else {
            format!("JR {},i8", condition)
        }
    }

    /* Returns */
    pub fn ret(&mut self, hw: &mut Hardware) -> String {
        let address = self.read_u16_tick(hw, self.sp);

        self.tick(hw); // internal

        self.pc = address;
        self.sp = self.sp.wrapping_add(2);

        "RET".to_string()
    }

    pub fn ret_cc(&mut self, hw: &mut Hardware, condition: JumpConditions) -> String {
        let condition_result = match condition {
            JumpConditions::NZ => !self.f.contains(Flags::Z),
            JumpConditions::Z => self.f.contains(Flags::Z),
            JumpConditions::NC => !self.f.contains(Flags::C),
            JumpConditions::C => self.f.contains(Flags::C),
            JumpConditions::NONE => panic!("Use cpu.ret directly."),
        };

        self.tick(hw); // internal
        if condition_result {
            self.ret(hw);
        }

        format!("RET {}", condition)
    }

    pub fn reti(&mut self, hw: &mut Hardware) -> String {
        self.ret(hw);
        self.ime = true;

        "RETI".to_string()
    }

    pub fn rst(&mut self, hw: &mut Hardware, address: u16) -> String {
        self.tick(hw);
        self.sp = self.sp.wrapping_sub(2);
        self.write_u16_tick(hw, self.sp, self.pc);
        self.pc = address;

        format!("RST {}", address.to_hex())
    }

    pub fn push<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read16 + std::fmt::Display + Copy,
    {
        self.tick(hw); // internal

        let value = source.read16(self, hw);
        self.sp = self.sp.wrapping_sub(2);
        self.write_u16_tick(hw, self.sp, value);

        format!("PUSH {}", source)
    }

    pub fn pop<T>(&mut self, hw: &mut Hardware, target: T) -> String
    where
        T: Write16 + std::fmt::Display + Copy,
    {
        let value = self.read_u16_tick(hw, self.sp);
        self.sp = self.sp.wrapping_add(2);

        target.write16(self, hw, value);

        format!("POP {}", target)
    }

    pub fn ld_hl_sp_i8(&mut self, hw: &mut Hardware) -> String {
        let n = self.read_imm_u8_tick(hw) as i8 as i16 as u16;
        let result = self.sp.wrapping_add(n);

        let op = self.sp ^ n ^ result;
        self.update_flag(Flags::Z, false);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, op & 0x10 > 0);
        self.update_flag(Flags::C, op & 0x100 > 0);
        self.write_reg16(Reg16::HL, result);
        self.tick(hw); // internal

        "LD HL,SP+i8".to_string()
    }
}

// Rotates
impl Cpu {
    pub fn rlca(&mut self) -> String {
        let value = self.read_reg8(Reg8::A);
        let old_7bit = value & 0b1000_0000;
        let result = value.rotate_left(1);
        self.update_flag(Flags::Z, false);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_7bit > 0);

        self.write_reg8(Reg8::A, result);

        "RLCA".to_string()
    }

    pub fn rla(&mut self) -> String {
        let value = self.read_reg8(Reg8::A);
        let old_7bit = value & 0b1000_0000;
        let result = value << 1 | self.get_carry_bit();

        self.update_flag(Flags::Z, false);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_7bit > 0);

        self.write_reg8(Reg8::A, result);

        "RLA".to_string()
    }

    pub fn rrca(&mut self) -> String {
        let value = self.read_reg8(Reg8::A);
        let old_0bit = value & 0b0000_0001;
        let result = value.rotate_right(1);

        self.update_flag(Flags::Z, false);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_0bit > 0);

        self.write_reg8(Reg8::A, result);

        "RRCA".to_string()
    }

    pub fn rra(&mut self) -> String {
        let value = self.read_reg8(Reg8::A);
        let old_0bit = value & 0b0000_0001;
        let result = (value >> 1) | (self.get_carry_bit() << 7);

        self.update_flag(Flags::Z, false);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_0bit > 0);

        self.write_reg8(Reg8::A, result);

        "RRA".to_string()
    }
}

// Misc
impl Cpu {
    pub fn scf(&mut self) -> String {
        self.clear_flag(Flags::N);
        self.clear_flag(Flags::H);
        self.set_flag(Flags::C);

        "SCF".to_string()
    }

    pub fn ccf(&mut self) -> String {
        self.clear_flag(Flags::N);
        self.clear_flag(Flags::H);
        if self.f.contains(Flags::C) {
            self.clear_flag(Flags::C);
        } else {
            self.set_flag(Flags::C);
        }

        "CCF".to_string()
    }

    pub fn cpl(&mut self) -> String {
        let value = self.read_reg8(Reg8::A);
        let result = value ^ 0xff;
        self.write_reg8(Reg8::A, result);
        self.set_flag(Flags::N);
        self.set_flag(Flags::H);

        "CPL".to_string()
    }

    pub fn daa(&mut self) -> String {
        // https://ehaskins.com/2018-01-30%20Z80%20DAA/
        // Thank you master
        let a = self.read_reg8(Reg8::A);
        let mut carry = false;

        let flag_h = self.f.contains(Flags::H);
        let flag_c = self.f.contains(Flags::C);
        let flag_n = self.f.contains(Flags::N);

        let mut correction = 0;

        if flag_h || (!flag_n && (a & 0xf) > 0x09) {
            correction |= 0x06;
        }

        if flag_c || (!flag_n && a > 0x99) {
            correction |= 0x60;
            carry = true;
        }

        let result = if flag_n {
            a.wrapping_sub(correction)
        } else {
            a.wrapping_add(correction)
        };

        self.update_flag(Flags::C, carry);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::Z, result == 0);
        self.write_reg8(Reg8::A, result);

        "DDA".to_string()
    }

    pub fn halt(&mut self, hw: &mut Hardware) -> String {
        self.halted = true;
        if hw.interrupts.has_available_interrupts() {
            if self.ime {
                self.halted = false;
                self.increment_pc();
            } else {
                self.halted = false;
                self.halt_bug = true;
            }
        }
        self.just_halted = true;

        "HALT".to_string()
    }

    pub fn di(&mut self) -> String {
        self.ime = false;

        "DI".to_string()
    }

    pub fn ei(&mut self) -> String {
        self.ime_requested = true;

        "EI".to_string()
    }
}

// Calls
impl Cpu {
    pub fn call_cc(&mut self, hw: &mut Hardware, condition: JumpConditions) -> String {
        let condition_result = match condition {
            JumpConditions::NZ => !self.f.contains(Flags::Z),
            JumpConditions::Z => self.f.contains(Flags::Z),
            JumpConditions::NC => !self.f.contains(Flags::C),
            JumpConditions::C => self.f.contains(Flags::C),
            JumpConditions::NONE => true,
        };

        let next_instruction_address = self.pc.wrapping_add(2);
        let new_address = self.read_imm_u16_tick(hw);
        if condition_result {
            self.tick(hw); // internal
            self.sp = self.sp.wrapping_sub(2);
            self.write_u16_tick(hw, self.sp, next_instruction_address);
            self.pc = new_address;
        }

        format!("CALL {},u16", condition)
    }
}

// ALU16
impl Cpu {
    pub fn add16<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read16 + std::fmt::Display + Copy,
    {
        let value = source.read16(self, hw);
        let hl = self.read_reg16(Reg16::HL);

        let result = hl.wrapping_add(value);
        self.clear_flag(Flags::N);
        if hl > 0xffff - value {
            self.set_flag(Flags::C);
        } else {
            self.clear_flag(Flags::C);
        }

        if (hl ^ value ^ result) & 0x1000 != 0 {
            self.set_flag(Flags::H);
        } else {
            self.clear_flag(Flags::H);
        }

        self.write_reg16(Reg16::HL, result);
        self.tick(hw); // internal

        format!("ADD HL,{}", source)
    }

    pub fn add_sp_i8(&mut self, hw: &mut Hardware) -> String {
        let n = self.read_imm_u8_tick(hw) as i8 as i16 as u16;
        let result = self.sp.wrapping_add(n);

        let op = self.sp ^ n ^ result;
        self.update_flag(Flags::Z, false);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, op & 0x10 > 0);
        self.update_flag(Flags::C, op & 0x100 > 0);

        self.sp = result;
        self.tick(hw); // internal
        self.tick(hw); // internal

        "ADD SP,i8".to_string()
    }
}

// CB
impl Cpu {
    pub fn bit<S>(&mut self, hw: &mut Hardware, bit_index: u8, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let bit_mask = 1 << bit_index;
        let bit = value & bit_mask;
        self.update_flag(Flags::Z, bit == 0);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, true);

        format!("BIT {},{} H={}", bit_index, source, value);
        format!("BIT {},{}", bit_index, source)
    }

    pub fn set<S>(&mut self, hw: &mut Hardware, bit_index: u8, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let mask = 1 << bit_index;
        let result = value | mask;
        source.write8(self, hw, result);

        format!("SET {},{}", bit_index, source)
    }

    pub fn res<S>(&mut self, hw: &mut Hardware, bit_index: u8, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let mask = !(1 << bit_index);
        let result = value & mask;
        source.write8(self, hw, result);

        format!("RES {},{}", bit_index, source)
    }

    pub fn rlc<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let old_7bit = value & 0b1000_0000;
        let result = value.rotate_left(1);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_7bit > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("RLC {}", source)
    }

    pub fn rrc<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let old_0bit = value & 0b0000_0001;
        let result = value.rotate_right(1);
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_0bit > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("RRC {}", source)
    }

    pub fn rl<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let old_7bit = value & 0b1000_0000;
        let result = (value << 1) | self.get_carry_bit();

        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_7bit > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("RL {}", source)
    }

    pub fn rr<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = (value >> 1) | (self.get_carry_bit() << 7);

        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, value & 1 > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("RR {}", source)
    }

    pub fn sla<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let old_7bit = value & 0b1000_0000;
        let result = value << 1;
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_7bit > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("SLA {}", source)
    }

    pub fn sra<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let old_7bit = value & 0b1000_0000;
        let old_0bit = value & 0b0000_0001;
        let result = (value >> 1) | old_7bit;
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, old_0bit > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("SRA {}", source)
    }

    pub fn srl<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let result = value >> 1;
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, value & 1 > 0);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("SRL {}", source)
    }

    pub fn swap<S>(&mut self, hw: &mut Hardware, source: S) -> String
    where
        S: Read8 + Write8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        let high = value << 4;
        let low = value >> 4;
        let result = high | low;
        self.update_flag(Flags::N, false);
        self.update_flag(Flags::H, false);
        self.update_flag(Flags::C, false);
        self.update_flag(Flags::Z, result == 0);

        source.write8(self, hw, result);

        format!("SWAP {}", source)
    }
}

impl Cpu {
    pub fn load8<T, S>(&mut self, hw: &mut Hardware, target: T, source: S) -> String
    where
        T: Write8 + std::fmt::Display + Copy,
        S: Read8 + std::fmt::Display + Copy,
    {
        let value = source.read8(self, hw);
        target.write8(self, hw, value);

        format!("LD {},{}", target, source)
    }

    pub fn load16<T, S>(&mut self, hw: &mut Hardware, target: T, source: S) -> String
    where
        T: Write16 + std::fmt::Display + Copy,
        S: Read16 + std::fmt::Display + Copy,
    {
        let value = source.read16(self, hw);
        target.write16(self, hw, value);

        format!("LD {},{}", target, source)
    }
}

/* 8bit operations */
pub trait Read8 {
    fn read8(self, cpu: &mut Cpu, hw: &mut Hardware) -> u8;
}
pub trait Write8 {
    fn write8(self, cpu: &mut Cpu, hw: &mut Hardware, value: u8);
}

impl Read8 for Reg8 {
    fn read8(self, cpu: &mut Cpu, _: &mut Hardware) -> u8 {
        cpu.read_reg8(self)
    }
}

impl Write8 for Reg8 {
    fn write8(self, cpu: &mut Cpu, _: &mut Hardware, value: u8) {
        cpu.write_reg8(self, value);
    }
}

impl Addr {
    fn modify_address_register(self, cpu: &mut Cpu) {
        match self {
            Addr::HLI => {
                let value = cpu.read_reg16(Reg16::HL);
                cpu.write_reg16(Reg16::HL, value.wrapping_add(1));
            }
            Addr::HLD => {
                let value = cpu.read_reg16(Reg16::HL);
                cpu.write_reg16(Reg16::HL, value.wrapping_sub(1));
            }
            _ => {}
        }
    }

    fn read_address(self, cpu: &mut Cpu, hw: &mut Hardware) -> u16 {
        match self {
            Addr::U16 => cpu.read_imm_u16_tick(hw),
            Addr::BC => cpu.read_reg16(Reg16::BC),
            Addr::DE => cpu.read_reg16(Reg16::DE),
            Addr::HL => cpu.read_reg16(Reg16::HL),
            Addr::HLI => {
                let address = cpu.read_reg16(Reg16::HL);
                self.modify_address_register(cpu);
                address
            }
            Addr::HLD => {
                let address = cpu.read_reg16(Reg16::HL);
                self.modify_address_register(cpu);
                address
            }
            Addr::HighC => 0xff00 + cpu.read_reg8(Reg8::C) as u16,
            Addr::HighU8 => 0xff00 + cpu.read_imm_u8_tick(hw) as u16,
        }
    }
}

impl Read8 for Addr {
    fn read8(self, cpu: &mut Cpu, hw: &mut Hardware) -> u8 {
        let address = self.read_address(cpu, hw);
        cpu.read_u8_tick(hw, address)
    }
}

impl Write8 for Addr {
    fn write8(self, cpu: &mut Cpu, hw: &mut Hardware, value: u8) {
        let address = self.read_address(cpu, hw);
        cpu.write_u8_tick(hw, address, value);
    }
}

impl Read8 for ImmediateU8 {
    fn read8(self, cpu: &mut Cpu, hw: &mut Hardware) -> u8 {
        cpu.read_imm_u8_tick(hw)
    }
}

/* 16bit operations */
pub trait Read16 {
    fn read16(self, cpu: &mut Cpu, hw: &mut Hardware) -> u16;
}

pub trait Write16 {
    fn write16(self, cpu: &mut Cpu, hw: &mut Hardware, value: u16);
}

impl Read16 for Reg16 {
    fn read16(self, cpu: &mut Cpu, _: &mut Hardware) -> u16 {
        cpu.read_reg16(self)
    }
}

impl Write16 for Reg16 {
    fn write16(self, cpu: &mut Cpu, _: &mut Hardware, value: u16) {
        cpu.write_reg16(self, value)
    }
}

impl Read16 for ImmediateU16 {
    fn read16(self, cpu: &mut Cpu, hw: &mut Hardware) -> u16 {
        cpu.read_imm_u16_tick(hw)
    }
}

impl Write16 for ImmediateU16 {
    fn write16(self, cpu: &mut Cpu, hw: &mut Hardware, value: u16) {
        let address = cpu.read_imm_u16_tick(hw);
        cpu.write_u16_tick(hw, address, value);
    }
}
