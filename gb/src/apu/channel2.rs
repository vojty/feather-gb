use crate::utils::get_invalid_address;

use super::{
    frequency_timer::{FrequencyTimer, FrequencyTimerType},
    length_counter::LengthCounter,
    registers::*,
    volume_envelope::VolumeEnvelope,
    wave_duty::WaveDuty,
};

const MAX_LENGTH_TIMER: u16 = 64;

pub struct Channel2 {
    pub volume_envelope: VolumeEnvelope,
    length_counter: LengthCounter,
    frequency_timer: FrequencyTimer,
    wave: WaveDuty,
    dac_enabled: bool,
    pub channel_enabled: bool,
}

impl Channel2 {
    pub fn new() -> Self {
        Self {
            channel_enabled: false,
            dac_enabled: false,
            volume_envelope: VolumeEnvelope::new(),
            length_counter: LengthCounter::new(MAX_LENGTH_TIMER),
            frequency_timer: FrequencyTimer::new(FrequencyTimerType::Wave),
            wave: WaveDuty::new(),
        }
    }

    pub fn tick(&mut self) {
        let reset = self.frequency_timer.tick();
        if reset {
            self.wave.tick();
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
            let data =
                self.wave.get_data() as f32 * self.volume_envelope.get_current_volume() as f32;
            return (data / 7.5) - 1.0;
        }
        0.0
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_NR21 => self.wave.read_byte(),
            R_NR22 => self.volume_envelope.read_byte(),
            R_NR23 => 0xff,
            R_NR24 => 0b1011_1111 | (self.length_counter.get_enabled() as u8) << 6,
            _ => panic!(get_invalid_address("APU Channel 2 (read)", address)),
        }
    }

    pub fn write_byte(
        &mut self,
        address: u16,
        value: u8,
        next_step_is_length: bool,
        apu_enabled: bool,
    ) {
        match address {
            R_NR21 => {
                if apu_enabled {
                    self.wave.write_byte(value);
                }
                self.length_counter.set_counter(value & 0b0011_1111);
            }
            R_NR22 => {
                self.volume_envelope.write_byte(value);

                // Top 5 bits enables/disabled DAC
                self.dac_enabled = value & 0b1111_1000 > 0;

                // Disabled DAC also disables channel
                if !self.dac_enabled {
                    self.channel_enabled = false;
                }
            }
            R_NR23 => self.frequency_timer.set_frequency_low(value),
            R_NR24 => {
                self.frequency_timer.set_frequency_high(value);

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
            _ => panic!(get_invalid_address("APU Channel 2 (write)", address)),
        }
    }
}
