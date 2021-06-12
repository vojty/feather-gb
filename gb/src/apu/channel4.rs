use crate::utils::get_invalid_address;

use super::{length_counter::LengthCounter, registers::*, volume_envelope::VolumeEnvelope};

const MAX_LENGTH_TIMER: u16 = 64;
pub struct Channel4 {
    length_counter: LengthCounter,
    pub volume_envelope: VolumeEnvelope,
    dac_enabled: bool,
    pub channel_enabled: bool,
    nr43: u8, // TODO
}

impl Channel4 {
    pub fn new() -> Self {
        Self {
            nr43: 0,
            channel_enabled: false,
            dac_enabled: false,
            length_counter: LengthCounter::new(MAX_LENGTH_TIMER),
            volume_envelope: VolumeEnvelope::new(),
        }
    }

    pub fn tick(&mut self) {}

    pub fn tick_length_timer(&mut self) {
        let expired = self.length_counter.tick();
        if expired {
            self.channel_enabled = false;
        }
    }

    pub fn get_amplitude(&self) -> f32 {
        0.0
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_NR41 => 0xff,
            R_NR42 => self.volume_envelope.read_byte(),
            R_NR43 => self.nr43,
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
                self.nr43 = value;
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

                    if self.dac_enabled {
                        self.channel_enabled = true;
                    }
                }
            }
            _ => panic!(get_invalid_address("APU Channel 4 (write)", address)),
        }
    }
}
