use bitflags::bitflags;

use crate::{
    constants::CPU_CLOCK_SPEED,
    interrupts::{InterruptBits, InterruptController},
    utils::get_invalid_address,
};

/**
 * Divider Register
 *
 * This register is incremented 16384 (~16779 on SGB) times a second. Writing any value sets it to $00.
 */
const R_DIV: u16 = 0xff04;

/**
 * Timer counter
 *
 * This timer is incremented by a clock frequency specified by the TAC register ($FF07). The timer generates an interrupt when it overflows.
 */
const R_TIMA: u16 = 0xff05;

/**
 * Timer Modulo (R/W)
 *
 * When the TIMA overflows, this data will be loaded.
 */
const R_TMA: u16 = 0xff06;

/**
 * Timer Control (R/W)
 *
 * Bits 3-7 unused = always 1
 * Bit 2 - Timer Stop
 *    0: Stop Timer
 *    1: Start Timer
 *
 * Bits 1+0 - Input Clock Select
 *    00: 4.096 KHz (~4.194 KHz SGB)
 *    01: 262.144 Khz (~268.4 KHz SGB)
 *    10: 65.536 KHz (~67.11 KHz SGB)
 *    11: 16.384 KHz (~16.78 KHz SGB)
 */
const R_TAC: u16 = 0xff07;

const TAC_UNUSED_MASK: u8 = 0b1111_1000;

bitflags! {
    pub struct TacBits: u8 {
        const ENABLED    = 0b0000_0100;
        const CLOCK_HIGH = 0b0000_0010;
        const CLOCK_LOW  = 0b0000_0001;
    }
}

pub struct Timer {
    pub divider_counter: u16,
    pub tima: u8,
    pub tac: TacBits,
    pub tma: u8,

    loading_delay_clocks: i8,
}

impl Timer {
    pub fn new() -> Timer {
        Timer {
            divider_counter: 0,
            tac: TacBits::empty(),
            tima: 0,
            tma: 0,
            loading_delay_clocks: 0,
        }
    }

    pub fn init_without_bios(&mut self) {
        self.divider_counter = 0x1833;
        self.tac = TacBits::from_bits_truncate(0x00);
        self.tima = 0x00;
        self.tma = 0x00;
    }

    fn get_frequency_edge(&mut self) -> u16 {
        self.get_frequency() / 2
    }

    fn get_frequency(&mut self) -> u16 {
        // cycles needed to increment the counter
        // CPU 4 MHz / timer frequency = # cycles
        let cycles = match self.tac.bits() & 0b11 {
            0b01 => CPU_CLOCK_SPEED / 262_144, // every   16 cycles
            0b10 => CPU_CLOCK_SPEED / 65_536,  // every   64 cycles
            0b11 => CPU_CLOCK_SPEED / 16_384,  // every  256 cycles
            _ => CPU_CLOCK_SPEED / 4_096,      // every 1024 cycles
        };
        cycles as u16
    }

    fn is_enabled(&mut self) -> bool {
        self.tac.contains(TacBits::ENABLED)
    }

    fn has_counter_bit(&mut self) -> bool {
        if !self.is_enabled() {
            return false;
        }
        (self.divider_counter & (self.get_frequency_edge() as u16)) > 0
    }

    fn increment_tima(&mut self, ic: &mut InterruptController) {
        self.tima = self.tima.wrapping_add(1);
        if self.tima == 0 {
            // TIMA loading has delay but interrupt is triggered right away
            self.loading_delay_clocks = 4;
            ic.request_interrupt(InterruptBits::TIMER);
        }
    }

    pub fn tick(&mut self, ic: &mut InterruptController) {
        let prev_counter_bit = self.has_counter_bit();
        self.divider_counter = self.divider_counter.wrapping_add(1);

        if self.loading_delay_clocks >= 0 {
            self.loading_delay_clocks -= 1;
        }
        if self.loading_delay_clocks == 0 {
            self.tima = self.tma;
        }

        if !self.is_enabled() {
            return;
        }

        // Timer is incremented on falling edge (on change from 1 to 0)
        if prev_counter_bit && !self.has_counter_bit() {
            self.increment_tima(ic);
        }
    }
}

impl Timer {
    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_DIV => (self.divider_counter >> 8) as u8,
            R_TIMA => self.tima,
            R_TMA => self.tma,
            R_TAC => self.tac.bits() | TAC_UNUSED_MASK,
            _ => panic!(get_invalid_address("Timer (read)", address)),
        }
    }
    pub fn write_byte(&mut self, address: u16, value: u8, ic: &mut InterruptController) {
        match address {
            R_DIV => {
                if self.has_counter_bit() {
                    self.increment_tima(ic);
                }
                self.divider_counter = 0
            }
            R_TIMA => {
                if self.loading_delay_clocks != 0 {
                    self.tima = value;

                    self.loading_delay_clocks = -1;
                }
            }
            R_TMA => {
                self.tma = value;
                if self.loading_delay_clocks == 0 {
                    self.tima = value
                }
            }
            R_TAC => {
                let prev_counter_bit = self.has_counter_bit();
                self.tac = TacBits::from_bits_truncate(value);

                if prev_counter_bit && !self.has_counter_bit() {
                    self.increment_tima(ic);
                }
            }
            _ => panic!(get_invalid_address("Timer (write)", address)),
        }
    }
}
