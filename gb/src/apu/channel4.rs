use crate::utils::get_invalid_address;

use super::{length_counter::LengthCounter, registers::*, volume_envelope::VolumeEnvelope};

const MAX_LENGTH_TIMER: u16 = 64;
pub struct Channel4 {
    length_counter: LengthCounter,
    pub volume_envelope: VolumeEnvelope,
    dac_enabled: bool,
    pub channel_enabled: bool,
    clock_shift: u8,
    width_mode: u8,
    divisor_code: u8,
    lfsr: u16,
    frequency_timer: u32, // max value can be (112 << 0xf)
}

const DIVISORS_TABLE: [u8; 8] = [8, 16, 32, 48, 64, 80, 96, 112];

impl Channel4 {
    pub fn new() -> Self {
        Self {
            clock_shift: 0,
            width_mode: 0,
            divisor_code: 0,
            lfsr: 0,

            frequency_timer: 0,

            channel_enabled: false,
            dac_enabled: false,
            length_counter: LengthCounter::new(MAX_LENGTH_TIMER),
            volume_envelope: VolumeEnvelope::new(),
        }
    }

    pub fn tick(&mut self) {
        if self.frequency_timer > 0 {
            self.frequency_timer -= 1;
        }

        if self.frequency_timer == 0 {
            let divisor = DIVISORS_TABLE[self.divisor_code as usize];
            self.frequency_timer = (divisor as u32) << self.clock_shift;

            // XOR of 0th and 1st bits
            let result = (self.lfsr ^ (self.lfsr >> 1)) & 0b1;

            if self.width_mode == 1 {
                // 7bit width
                self.lfsr = ((self.lfsr >> 1) & !0x40) | (result << 6);
            } else {
                // 15 bit width
                self.lfsr = ((self.lfsr >> 1) & !0x4000) | (result << 14);
            }
        }
    }

    pub fn tick_length_timer(&mut self) {
        let expired = self.length_counter.tick();
        if expired {
            self.channel_enabled = false;
        }
    }

    pub fn get_amplitude(&self) -> f32 {
        if self.dac_enabled && self.channel_enabled {
            let data = (!self.lfsr & 0b1) as f32 * self.volume_envelope.get_current_volume() as f32;
            return (data / 7.5) - 1.0;
        }
        0.0
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_NR41 => 0xff,
            R_NR42 => self.volume_envelope.read_byte(),
            R_NR43 => self.clock_shift << 4 | self.width_mode << 3 | self.divisor_code,
            R_NR44 => 0b1011_1111 | (self.length_counter.get_enabled() as u8) << 6,
            _ => panic!(get_invalid_address("APU Channel 4 (read)", address)),
        }
    }

    pub fn write_byte(&mut self, address: u16, value: u8, next_step_is_length: bool) {
        match address {
            R_NR41 => {
                self.length_counter.set_counter(value & 0b0011_1111);
            }
            R_NR42 => {
                self.volume_envelope.write_byte(value);

                // Top 5 bits enables/disabled DAC
                self.dac_enabled = value & 0b1111_1000 > 0;

                // Disabled DAC also disables channel
                if !self.dac_enabled {
                    self.channel_enabled = false;
                }
            }
            R_NR43 => {
                self.clock_shift = value & 0b1111_0000;
                self.width_mode = value & 0b0000_1000;
                self.divisor_code = value & 0b0000_0111;
            }
            R_NR44 => {
                let (should_disable_channel, restart_triggered) = self
                    .length_counter
                    .write_control(value, next_step_is_length);

                if should_disable_channel {
                    self.channel_enabled = false;
                }

                if restart_triggered {
                    self.volume_envelope.reset();

                    self.lfsr = 0x7fff;

                    if self.dac_enabled {
                        self.channel_enabled = true;
                    }
                }
            }
            _ => panic!(get_invalid_address("APU Channel 4 (write)", address)),
        }
    }
}
