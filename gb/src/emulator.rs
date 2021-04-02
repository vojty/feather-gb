use std::u16;

use log::debug;

use crate::{
    bios::BIOS,
    cartridges::cartridge::Cartridge,
    constants::CYCLES_PER_FRAME,
    cpu::cpu::{Cpu, Flags, Reg8},
    dma::OamDma,
    interrupts::InterruptController,
    joypad::{Joypad, JoypadKey},
    ppu::{
        ppu::{Palettes, Ppu},
        screen_buffer::Buffer,
    },
    timer::Timer,
    traits::{DisplayHex, MemoryAccess},
};
pub trait SplitU16 {
    fn split_to_u8(self) -> (u8, u8);
}

impl SplitU16 for u16 {
    fn split_to_u8(self) -> (u8, u8) {
        let high = (self >> 8) as u8;
        let low = (self & 0xff) as u8;
        (high, low)
    }
}

const RAM_START: u16 = 0xc000;
const RAM_END: u16 = 0xdfff;
const RAM_SIZE: usize = RAM_END as usize - RAM_START as usize + 1;

const HRAM_START: u16 = 0xff80;
const HRAM_END: u16 = 0xfffe;
const HRAM_SIZE: usize = HRAM_END as usize - HRAM_START as usize + 1;

pub struct Hardware {
    bios_enabled: bool,
    pub cartridge: Cartridge,
    pub ppu: Ppu,
    ram: Box<[u8; RAM_SIZE]>,
    hram: Box<[u8; HRAM_SIZE]>,
    capture_serial: bool,
    pub serial_output: Vec<char>,
    pub interrupts: InterruptController,
    pub timer: Timer,
    pub oam_dma: OamDma,
    joypad: Joypad,
    pub events: Vec<u8>, // TODO this is ugly check for tests for LD B,B breakpoint
}

impl MemoryAccess for Hardware {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            // Cartridge ROM - bank 0 - 16kb
            0x0000..=0x3fff => {
                if self.bios_enabled && (address as usize) < BIOS.len() {
                    return BIOS[address as usize];
                }
                self.cartridge.read_byte(address)
            }

            // Cartridge ROM - bank 1 - 16kb
            0x4000..=0x7fff => self.cartridge.read_byte(address),

            // Graphics RAM (VRAM)
            0x8000..=0x9fff => self.ppu.read_byte(address),

            // Cartridge (External) RAM
            0xa000..=0xbfff => self.cartridge.read_byte(address),

            // Working RAM - 8kb
            0xc000..=0xdfff => self.ram[(address & 0x1fff) as usize],

            // Working RAM (shadow) exact copy of previous working RAM, due to the HW wiring
            0xe000..=0xfdff => self.ram[(address & 0x1fff) as usize],

            // Sprite attribute table (OAM)
            0xfe00..=0xfe9f => {
                if self.oam_dma.is_active() {
                    return 0xff;
                }
                self.ppu.read_byte(address)
            }

            // Not Usable
            0xfea0..=0xfeff => 0xff,

            // I/O Registers
            0xff00..=0xff7f => match address {
                0xff00 => self.joypad.read_byte(address),         // Joypad
                0xff01..=0xff02 => 0xff,                          // Serial
                0xff03 => 0xff,                                   // unused
                0xff04..=0xff07 => self.timer.read_byte(address), // Timer
                0xff0f => self.interrupts.read_byte(address),     // Interrupt controller
                0xff10..=0xff3f => 0xff,                          // APU
                0xff40..=0xff45 => self.ppu.read_byte(address),   // PPU
                0xff46 => self.oam_dma.read_byte(),               // DMA
                0xff47..=0xff4b => self.ppu.read_byte(address),   // PPU
                _ => 0xff,                                        // unused
            },

            // High RAM (HRAM)
            0xff80..=0xfffe => self.hram[(address - HRAM_START) as usize],

            // Interrupts Enable Register (IE)
            0xffff => self.interrupts.read_byte(address),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        let ic = &mut self.interrupts;
        match address {
            // Cartridge ROM - bank 0 - 16kb
            0x0000..=0x3fff => self.cartridge.write_byte(address, value),

            // Cartridge ROM - bank 1 - 16kb
            0x4000..=0x7fff => self.cartridge.write_byte(address, value),

            // Graphics RAM (VRAM)
            0x8000..=0x9fff => self.ppu.write_byte(address, value, ic),

            // Cartridge (External) RAM
            0xa000..=0xbfff => self.cartridge.write_byte(address, value),

            // Working RAM - 8kb
            0xc000..=0xdfff => self.ram[(address & 0x1fff) as usize] = value,

            // Working RAM (shadow) exact copy of previous working RAM, due to the HW wiring
            0xe000..=0xfdff => self.ram[(address & 0x1fff) as usize] = value,

            // Sprite attribute table (OAM)
            0xfe00..=0xfe9f => {
                if self.oam_dma.is_active() {
                    return;
                }
                self.ppu.write_byte(address, value, ic)
            }

            // Not Usable
            0xfea0..=0xfeff => {}

            // I/O Registers
            0xff00..=0xff7f => match address {
                0xff00 => self.joypad.write_byte(address, value), // Joypad
                0xff01..=0xff02 => {
                    if self.capture_serial && address == 0xff01 {
                        self.serial_output.push(value as char);
                    }
                } // Serial
                0xff03 => {}                                      // unused
                0xff04..=0xff07 => self.timer.write_byte(address, value, ic), // Timer
                0xff0f => self.interrupts.write_byte(address, value), // Interrupt controller
                0xff10..=0xff3f => {}                             // APU
                0xff40..=0xff45 => self.ppu.write_byte(address, value, ic), // PPU
                0xff46 => self.oam_dma.request(value),            // DMA
                0xff47..=0xff4b => self.ppu.write_byte(address, value, ic), // PPU
                0xff50 => {
                    self.bios_enabled = false;
                }
                _ => {} // unused
            },

            // High RAM (HRAM)
            0xff80..=0xfffe => self.hram[(address - HRAM_START) as usize] = value,

            // Interrupts Enable Register (IE)
            0xffff => self.interrupts.write_byte(address, value),
        }
    }
}

pub struct Emulator {
    pub cpu: Cpu,
    pub hw: Hardware,
    pub frames: u32,
    executed_instructions: u32,
}

impl Emulator {
    pub fn new(bios_enabled: bool, cartridge: Cartridge) -> Emulator {
        let interrupt_controller = InterruptController::new();
        let ppu = Ppu::new();
        let mut e = Emulator {
            cpu: Cpu::new(),
            frames: 0,
            executed_instructions: 0,
            hw: Hardware {
                bios_enabled,
                ppu,
                timer: Timer::new(),
                interrupts: interrupt_controller,
                cartridge,
                capture_serial: false,
                serial_output: Vec::new(),
                ram: Box::new([0xff; RAM_SIZE]),
                hram: Box::new([0xff; HRAM_SIZE]),
                oam_dma: OamDma::new(),
                joypad: Joypad::new(),
                events: vec![],
            },
        };

        if !bios_enabled {
            e.cpu
                .write_reg8(Reg8::A, 0x01)
                .write_reg8(Reg8::B, 0xff)
                .write_reg8(Reg8::C, 0x13)
                .write_reg8(Reg8::D, 0x00)
                .write_reg8(Reg8::E, 0xc1)
                .write_reg8(Reg8::H, 0x84)
                .write_reg8(Reg8::L, 0x03)
                .update_flag(Flags::Z, false)
                .update_flag(Flags::N, false)
                .update_flag(Flags::H, false)
                .update_flag(Flags::C, false);
            e.cpu.sp = 0xfffe;
            e.cpu.pc = 0x0100;

            e.hw.timer.init_without_bios();
            e.hw.ppu.init_without_bios();
            e.hw.interrupts.init_without_bios();
        }

        e
    }

    pub fn run_frame(&mut self) {
        while self.cpu.frame_cycles < CYCLES_PER_FRAME {
            self.run_instruction();
            self.executed_instructions += 1;
        }
        self.frames += 1;
        self.cpu.frame_cycles = 0;
    }

    #[allow(dead_code)]
    fn create_peach_log_line(&mut self) {
        let pc = self.cpu.pc;
        let n1 = self.hw.read_byte(pc);
        let n2 = self.hw.read_byte(pc.wrapping_add(1));
        let n3 = self.hw.read_byte(pc.wrapping_add(2));
        let n4 = self.hw.read_byte(pc.wrapping_add(3));

        // {:02x}
        // : - special formatting
        // 02 - prepend 0 to max 2 chars
        // x - hex small (X - bigger hex)
        debug!(
            "A: {:02X} F: {:02X} B: {:02X} C: {:02X} D: {:02X} E: {:02X} H: {:02X} L: {:02X} SP: {:04X} PC: 00:{:04X} ({:02X} {:02X} {:02X} {:02X})",
            self.cpu.a,
            self.cpu.f,
            self.cpu.b,
            self.cpu.c,
            self.cpu.d,
            self.cpu.e,
            self.cpu.h,
            self.cpu.l,
            self.cpu.sp,
            pc,
            n1,
            n2,
            n3,
            n4
        );
    }

    fn handle_interrupts(&mut self) {
        self.cpu.ime = false;
        self.cpu.halted = false;

        self.cpu.tick(&mut self.hw);
        self.cpu.tick(&mut self.hw);
        self.cpu.tick(&mut self.hw);

        self.cpu.sp = self.cpu.sp.wrapping_sub(1);
        let (high, _) = self.cpu.pc.split_to_u8();
        self.cpu.write_u8_tick(&mut self.hw, self.cpu.sp, high);

        let address = self.hw.interrupts.ack_interrupt();

        self.cpu.sp = self.cpu.sp.wrapping_sub(1);
        let (_, low) = self.cpu.pc.split_to_u8();
        self.cpu.write_u8_tick(&mut self.hw, self.cpu.sp, low);

        self.cpu.pc = address;
    }

    pub fn run_instruction(&mut self) {
        if self.cpu.halted && !self.cpu.just_halted {
            self.cpu.tick(&mut self.hw);
        }

        let pending_interrupts = self.hw.interrupts.has_available_interrupts();

        self.cpu.just_halted = false;
        let current_ime = self.cpu.ime;

        if self.cpu.ime_requested {
            self.cpu.ime_requested = false;
            self.cpu.ime = true;
        }

        if self.cpu.halted && !current_ime && pending_interrupts {
            self.cpu.halted = false;
        } else if current_ime && pending_interrupts {
            self.cpu.halted = false;
            self.handle_interrupts();
        } else if !self.cpu.halted {
            let pc = self.cpu.pc;
            let cycles = self.cpu.total_cycles;
            let op_code = self.cpu.read_imm_u8_tick(&mut self.hw);
            if self.cpu.halt_bug {
                self.cpu.pc -= 1;
                self.cpu.halt_bug = false;
            }
            let executed = self.cpu.execute(op_code, &mut self.hw);

            if false {
                log::debug!("{} | {} | {}", cycles, pc.to_hex(), executed);
            }
        } else {
            // should not happend invalid state?
        }

        // self.create_peach_log_line();
    }

    pub fn on_key_down(&mut self, key: JoypadKey) {
        let ic = &mut self.hw.interrupts;
        self.hw.joypad.on_key_down(key, ic)
    }

    pub fn on_key_up(&mut self, key: JoypadKey) {
        let ic = &mut self.hw.interrupts;
        self.hw.joypad.on_key_up(key, ic)
    }

    pub fn get_screen_buffer(&self) -> &Buffer {
        self.hw.ppu.get_screen_buffer()
    }

    pub fn set_system_palette(&mut self, palette: Palettes) {
        self.hw.ppu.set_system_palette(palette);
    }

    pub fn set_capture_serial(&mut self, capture: bool) {
        self.hw.capture_serial = capture;
    }
}
