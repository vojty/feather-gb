use crate::utils::get_invalid_address;

use super::{
    frequency_timer::{FrequencyTimer, FrequencyTimerType},
    length_counter::LengthCounter,
    registers::*,
};

pub const WAVE_PATTERN_RAM_START: u16 = 0xff30;
pub const WAVE_PATTERN_RAM_END: u16 = 0xff3f;
const WAVE_PATTERN_RAM_SIZE: usize = (WAVE_PATTERN_RAM_END - WAVE_PATTERN_RAM_START + 1) as usize;
const SAMPLE_COUNT: usize = WAVE_PATTERN_RAM_SIZE * 2;

const MAX_LENGTH_TIMER: u16 = 256;

// Channel3 holds 32 4-bit samples (16 bytes in total)
// FF30 - Sample A + Sample B
// FF31 - Sample C + Sample D
// ...
pub struct Channel3 {
    pub channel_enabled: bool,
    dac_enabled: bool,
    length_counter: LengthCounter,
    frequency_timer: FrequencyTimer,
    wave_ram: Box<[u8; WAVE_PATTERN_RAM_SIZE]>,
    wave_position: usize,
    current_volume: u8,
}

fn get_ram_offset(address: u16) -> usize {
    (address - WAVE_PATTERN_RAM_START) as usize
}

impl Channel3 {
    pub fn new() -> Self {
        Self {
            channel_enabled: false,
            dac_enabled: false,
            length_counter: LengthCounter::new(MAX_LENGTH_TIMER),
            frequency_timer: FrequencyTimer::new(FrequencyTimerType::Channel3),
            wave_ram: Box::new([0x00; WAVE_PATTERN_RAM_SIZE]),
            wave_position: 0,
            current_volume: 0,
        }
    }

    pub fn tick(&mut self) {
        let reset = self.frequency_timer.tick();
        if reset {
            self.wave_position = (self.wave_position + 1) % SAMPLE_COUNT;
        }
    }

    pub fn tick_length_timer(&mut self) {
        let expired = self.length_counter.tick();
        if expired {
            self.channel_enabled = false;
        }
    }

    fn get_wave_index(&self) -> usize {
        self.wave_position >> 1 // one byte holds 2 4bit samples
    }

    pub fn get_amplitude(&self) -> f32 {
        if !self.dac_enabled {
            return 0.0;
        }

        let byte = self.wave_ram[self.get_wave_index()];

        // upper vs lower nibble
        let sample = if self.wave_position & 1 == 0 {
            byte >> 4
        } else {
            byte & 0x0f
        };

        let volume_shift = match self.current_volume {
            0b00 => 4, // mute
            0b01 => 0, // 100%
            0b10 => 1, // 50%
            0b11 => 2, // 25%
            _ => panic!("Unknown Channel 3 volume {}", self.current_volume),
        };

        let data = (sample >> volume_shift) as f32;
        (data / 7.5) - 1.0
    }

    fn get_rw_wave_ram_index(&self, address: u16) -> usize {
        if self.channel_enabled {
            return self.get_wave_index();
        }
        get_ram_offset(address)
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_NR30 => 0b0111_1111 | (self.dac_enabled as u8) << 7,
            R_NR31 => 0xff,
            R_NR32 => 0b1001_1111 | self.current_volume << 5,
            R_NR33 => 0xff,
            R_NR34 => 0b1011_1111 | (self.length_counter.get_enabled() as u8) << 6,
            WAVE_PATTERN_RAM_START..=WAVE_PATTERN_RAM_END => {
                self.wave_ram[self.get_rw_wave_ram_index(address)]
            }
            _ => panic!(get_invalid_address("APU Channel 3 (read)", address)),
        }
    }

    pub fn write_byte(&mut self, address: u16, value: u8, next_step_is_length: bool) {
        match address {
            R_NR30 => {
                self.dac_enabled = value & 0b1000_0000 > 0;
                if !self.dac_enabled {
                    self.channel_enabled = false;
                }
            }
            R_NR31 => self.length_counter.set_counter(value),
            R_NR32 => self.current_volume = (value & 0b0110_0000) >> 5,
            R_NR33 => self.frequency_timer.set_frequency_low(value),
            R_NR34 => {
                self.frequency_timer.set_frequency_high(value);

                let (should_disable_channel, restart_triggered) = self
                    .length_counter
                    .write_control(value, next_step_is_length);

                if should_disable_channel {
                    self.channel_enabled = false;
                }

                if restart_triggered {
                    self.wave_position = 0;

                    if self.dac_enabled {
                        self.channel_enabled = true;
                    }
                }
            }
            WAVE_PATTERN_RAM_START..=WAVE_PATTERN_RAM_END => {
                self.wave_ram[self.get_rw_wave_ram_index(address)] = value;
            }
            _ => panic!(get_invalid_address("APU Channel 3 (write)", address)),
        }
    }
}
