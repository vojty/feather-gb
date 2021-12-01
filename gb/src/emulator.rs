use std::u16;

use log::debug;

use crate::{
    apu::apu::Apu,
    audio::AudioDevice,
    bios::BIOS,
    cartridges::cartridge::Cartridge,
    cpu::cpu::{Cpu, Flags, Reg8},
    dma::OamDma,
    events::Events,
    hdma::Hdma,
    interrupts::InterruptController,
    joypad::{Joypad, JoypadKey},
    ppu::{palettes::DmgPalettes, ppu::Ppu, screen_buffer::Buffer},
    serial::Serial,
    timer::Timer,
    traits::MemoryAccess,
    wram::Wram,
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

const HRAM_START: u16 = 0xff80;
const HRAM_END: u16 = 0xfffe;
const HRAM_SIZE: usize = HRAM_END as usize - HRAM_START as usize + 1;

pub struct Hardware {
    is_cgb: bool,
    bios_enabled: bool,
    pub cartridge: Cartridge,
    pub ppu: Ppu,
    pub apu: Apu,
    wram: Wram,
    hram: Box<[u8; HRAM_SIZE]>,
    capture_serial: bool,
    pub serial_output: Vec<char>,
    pub interrupts: InterruptController,
    serial: Serial,
    pub timer: Timer,
    pub oam_dma: OamDma,
    pub hdma: Hdma,
    joypad: Joypad,
    pub events: Events,
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
            0xc000..=0xdfff => self.wram.read_byte(address),

            // Working RAM (shadow) exact copy of previous working RAM, due to the HW wiring
            0xe000..=0xfdff => self.wram.read_byte(address - 0x2000),

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
                0xff00 => self.joypad.read_byte(address),          // Joypad
                0xff01..=0xff02 => self.serial.read_byte(address), // Serial
                0xff03 => 0xff,                                    // unused
                0xff04..=0xff07 => self.timer.read_byte(address),  // Timer
                0xff0f => self.interrupts.read_byte(address),      // Interrupt controller
                0xff10..=0xff14 => self.apu.read_byte(address),    // APU Channel 1
                0xff16..=0xff19 => self.apu.read_byte(address),    // APU Channel 2
                0xff1a..=0xff1e => self.apu.read_byte(address),    // APU Channel 3
                0xff20..=0xff23 => self.apu.read_byte(address),    // APU Channel 4
                0xff24..=0xff26 => self.apu.read_byte(address),    // APU Sound controls
                0xff30..=0xff3f => self.apu.read_byte(address),    // APU Channel 3 Wave RAM
                0xff40..=0xff45 => self.ppu.read_byte(address),    // PPU
                0xff46 => self.oam_dma.read_byte(),                // DMA
                0xff47..=0xff4b => self.ppu.read_byte(address),    // PPU
                0xff4f => {
                    if self.is_cgb {
                        self.ppu.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB VRAM bank switch
                0xff51..=0xff55 => {
                    if self.is_cgb {
                        self.hdma.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB HDMA
                0xff68 => {
                    if self.is_cgb {
                        self.ppu.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB Background Palette Index
                0xff69 => {
                    if self.is_cgb {
                        self.ppu.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB Background Palette Data
                0xff6a => {
                    if self.is_cgb {
                        self.ppu.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB Object Palette Index
                0xff6b => {
                    if self.is_cgb {
                        self.ppu.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB Object Palette Data
                0xff6c => {
                    if self.is_cgb {
                        self.ppu.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB Object Priority Mode
                0xff70 => {
                    if self.is_cgb {
                        self.wram.read_byte(address)
                    } else {
                        0xff
                    }
                } // CGB WRAM bank switch
                _ => 0xff,                                         // unused
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
            0xc000..=0xdfff => self.wram.write_byte(address, value),

            // Working RAM (shadow) exact copy of previous working RAM, due to the HW wiring
            0xe000..=0xfdff => self.wram.write_byte(address - 0x2000, value),

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
                    self.serial.write_byte(address, value)
                } // Serial
                0xff04..=0xff07 => self.timer.write_byte(address, value, ic), // Timer
                0xff0f => self.interrupts.write_byte(address, value), // Interrupt controller
                0xff10..=0xff14 => self.apu.write_byte(address, value), // APU Channel 1
                0xff16..=0xff19 => self.apu.write_byte(address, value), // APU Channel 2
                0xff1a..=0xff1e => self.apu.write_byte(address, value), // APU Channel 3
                0xff20..=0xff23 => self.apu.write_byte(address, value), // APU Channel 4
                0xff24..=0xff26 => self.apu.write_byte(address, value), // APU Sound controls
                0xff30..=0xff3f => self.apu.write_byte(address, value), // APU Channel 3 Wave RAM
                0xff40..=0xff45 => self.ppu.write_byte(address, value, ic), // PPU
                0xff46 => self.oam_dma.request(value),            // DMA
                0xff47..=0xff4b => self.ppu.write_byte(address, value, ic), // PPU
                0xff50 => self.bios_enabled = false,              // Remove bios
                0xff4f => self.ppu.write_byte(address, value, ic), // CGB VRAM bank switch
                0xff51..=0xff55 => self.hdma.write_byte(address, value), // CGB HDMA
                0xff68 => self.ppu.write_byte(address, value, ic), // CGB Background Palette Index
                0xff69 => self.ppu.write_byte(address, value, ic), // CGB Background Palette Data
                0xff6a => self.ppu.write_byte(address, value, ic), // CGB Object Palette Index
                0xff6b => self.ppu.write_byte(address, value, ic), // CGB Object Palette Data
                0xff6c => self.ppu.write_byte(address, value, ic), // CGB Object Priority Mode
                0xff70 => self.wram.write_byte(address, value),   // CGB WRAM bank switch
                _ => {}                                           // unused
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
    is_cgb: bool,
}

impl Emulator {
    pub fn new(
        bios_enabled: bool,

        cartridge: Cartridge,
        audio_device: Box<dyn AudioDevice>,
    ) -> Emulator {
        let interrupt_controller = InterruptController::new();
        let is_cgb = cartridge.supports_cgb();
        let ppu = Ppu::new(is_cgb);
        let apu = Apu::new(audio_device);
        let mut e = Emulator {
            cpu: Cpu::new(),
            frames: 0,
            executed_instructions: 0,
            hw: Hardware {
                is_cgb,
                bios_enabled,
                ppu,
                apu,
                serial: Serial::new(),
                timer: Timer::new(),
                interrupts: interrupt_controller,
                cartridge,
                capture_serial: false,
                serial_output: Vec::new(),
                wram: Wram::new(is_cgb),
                hram: Box::new([0xff; HRAM_SIZE]),
                oam_dma: OamDma::new(),
                hdma: Hdma::new(),
                joypad: Joypad::new(),
                events: Events::empty(),
            },
            is_cgb,
        };

        if !bios_enabled {
            let a = if e.is_cgb { 0x11 } else { 0x01 };
            e.cpu
                .write_reg8(Reg8::A, a)
                .write_reg8(Reg8::B, 0x00)
                .write_reg8(Reg8::C, 0x13)
                .write_reg8(Reg8::D, 0x00)
                .write_reg8(Reg8::E, 0xd8)
                .write_reg8(Reg8::H, 0x01)
                .write_reg8(Reg8::L, 0x4d)
                .update_flag(Flags::Z, true)
                .update_flag(Flags::N, false)
                .update_flag(Flags::H, true)
                .update_flag(Flags::C, true);
            e.cpu.sp = 0xfffe;
            e.cpu.pc = 0x0100;

            e.hw.timer.init_without_bios();
            e.hw.ppu.init_without_bios();
            e.hw.apu.init_without_bios();
            e.hw.interrupts.init_without_bios();
        }

        e
    }

    pub fn run_frame(&mut self) {
        loop {
            self.run_instruction();
            self.executed_instructions += 1;
            if self.hw.events.contains(Events::V_BLANK) {
                self.hw.events.remove(Events::V_BLANK);
                break;
            }
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

        // self.create_peach_log_line();
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
            let op_code = self.cpu.read_imm_u8_tick(&mut self.hw);
            if self.cpu.halt_bug {
                self.cpu.pc -= 1;
                self.cpu.halt_bug = false;
            }
            self.cpu.execute(op_code, &mut self.hw);
        } else {
            // should not happend invalid state?
        }
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

    pub fn set_system_palette(&mut self, palette: &DmgPalettes) {
        self.hw.ppu.set_system_palette(palette);
    }

    pub fn set_capture_serial(&mut self, capture: bool) {
        self.hw.capture_serial = capture;
    }

    pub fn set_audio_device(&mut self, audio_device: Box<dyn AudioDevice>) {
        self.hw.apu.set_audio_device(audio_device);
    }

    pub fn is_cgb(&self) -> bool {
        self.is_cgb
    }
}
