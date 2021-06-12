use bitflags::bitflags;

use super::{
    channel1::Channel1,
    channel2::Channel2,
    channel3::{Channel3, WAVE_PATTERN_RAM_END, WAVE_PATTERN_RAM_START},
    channel4::Channel4,
    frame_sequencer::FrameSequencer,
    registers::*,
};
use crate::{
    audio::AudioDevice,
    constants::{AUDIO_BUFFER_SIZE, AUDIO_CYCLES_PER_SAMPLE},
    traits::MemoryAccess,
    utils::get_invalid_address,
};

bitflags!(
  #[derive(Default)]
  struct EnabledChannels: u8 {
    const CHANNEL_1 = 0b0001;
    const CHANNEL_2 = 0b0010;
    const CHANNEL_3 = 0b0100;
    const CHANNEL_4 = 0b1000;
  }
);

#[derive(Default, Debug)]
struct Terminal {
    pub vin: bool,
    pub volume: u8,
    pub enabled_channels: EnabledChannels,
}

impl Terminal {
    fn mix_outputs(&self, channel1: f32, channel2: f32, channel3: f32, channel4: f32) -> f32 {
        // 0-7 => 0-1
        let volume = self.volume as f32 / 7.0;

        let mut amplitude = 0.0;
        if self.enabled_channels.contains(EnabledChannels::CHANNEL_1) {
            amplitude += channel1;
        }
        if self.enabled_channels.contains(EnabledChannels::CHANNEL_2) {
            amplitude += channel2;
        }
        if self.enabled_channels.contains(EnabledChannels::CHANNEL_3) {
            amplitude += channel3;
        }
        if self.enabled_channels.contains(EnabledChannels::CHANNEL_4) {
            amplitude += channel4;
        }
        volume * amplitude / 4.0
    }
}

/*
    Channel steps / components

    FrequencyTimer
        - advanced on every T-cycle
        - used in all channels
        - when expires, the sound output is adjusted (wave or square generation) and internal timer is reloaded

    WaveDuty
        - advanced by FrameSequencer
        - used by channels 1 & 2
        - has 8 steps, every step adjusts the output square

    LengthCounter
        - advanced by FrameSequencer
        - use in all channels
        - the channel is disabled when expires

    VolumeEnvelope
        - advanced by FrameSequencer
        - used in channels 1 & 2
        - periodically adjusts the volume

    Sweep
        - used in channel 1 only
        - periodically adjusts the frequency of FrequencyTimer
*/

pub struct Apu {
    frame_sequencer: FrameSequencer,
    enabled: bool,
    sample_cycles: usize, // audio frame cycles

    channel1: Channel1,
    channel2: Channel2,
    channel3: Channel3,
    channel4: Channel4,
    right: Terminal, // SO1
    left: Terminal,  // SO2

    pub buffer: Box<[f32; AUDIO_BUFFER_SIZE]>,
    buffer_position: usize,

    audio_device: Box<dyn AudioDevice>,
}

impl Apu {
    pub fn new(audio_device: Box<dyn AudioDevice>) -> Self {
        Self {
            frame_sequencer: FrameSequencer::new(),
            enabled: false,
            sample_cycles: 0,
            channel1: Channel1::new(),
            channel2: Channel2::new(),
            channel3: Channel3::new(),
            channel4: Channel4::new(),
            right: Terminal::default(),
            left: Terminal::default(),

            audio_device,
            buffer: Box::new([0.0; AUDIO_BUFFER_SIZE]),
            buffer_position: 0,
        }
    }

    pub fn init_without_bios(&mut self) {
        self.write_byte(0xff26, 0xf1); // NR52 enable first
        self.write_byte(0xff10, 0x80); // NR10
        self.write_byte(0xff11, 0xbf); // NR11
        self.write_byte(0xff12, 0xf3); // NR12
        self.write_byte(0xff14, 0xbf); // NR14
        self.write_byte(0xff16, 0x3f); // NR21
        self.write_byte(0xff17, 0x00); // NR22
        self.write_byte(0xff19, 0xbf); // NR24
        self.write_byte(0xff1a, 0x7f); // NR30
        self.write_byte(0xff1b, 0xff); // NR31
        self.write_byte(0xff1c, 0x9f); // NR32
        self.write_byte(0xff1e, 0xbf); // NR33
        self.write_byte(0xff20, 0xff); // NR41
        self.write_byte(0xff21, 0x00); // NR42
        self.write_byte(0xff22, 0x00); // NR43
        self.write_byte(0xff23, 0xbf); // NR30
        self.write_byte(0xff24, 0x77); // NR50
        self.write_byte(0xff25, 0xf3); // NR51
    }

    pub fn set_audio_device(&mut self, audio_device: Box<dyn AudioDevice>) {
        self.audio_device = audio_device;
    }

    pub fn tick(&mut self) {
        if !self.enabled {
            return;
        }

        self.sample_cycles = self.sample_cycles.wrapping_add(1);

        self.channel1.tick();
        self.channel2.tick();
        self.channel3.tick();
        self.channel4.tick();

        // Advance components with frame sequencer
        if let Some(step) = self.frame_sequencer.tick() {
            match step {
                0 => {
                    self.channel1.tick_length_timer();
                    self.channel2.tick_length_timer();
                    self.channel3.tick_length_timer();
                    self.channel4.tick_length_timer();
                }
                2 => {
                    self.channel1.tick_length_timer();
                    self.channel2.tick_length_timer();
                    self.channel3.tick_length_timer();
                    self.channel4.tick_length_timer();
                    self.channel1.tick_sweep();
                }
                4 => {
                    self.channel1.tick_length_timer();
                    self.channel2.tick_length_timer();
                    self.channel3.tick_length_timer();
                    self.channel4.tick_length_timer();
                }
                6 => {
                    self.channel1.tick_length_timer();
                    self.channel2.tick_length_timer();
                    self.channel3.tick_length_timer();
                    self.channel4.tick_length_timer();
                    self.channel1.tick_sweep();
                }
                7 => {
                    self.channel1.volume_envelope.tick();
                    self.channel2.volume_envelope.tick();
                    self.channel4.volume_envelope.tick();
                }
                _ => (),
            }
        }

        // Create sample
        if self.sample_cycles == AUDIO_CYCLES_PER_SAMPLE {
            self.sample_cycles = 0;

            // Mix channels
            let amp_channel1 = self.channel1.get_amplitude();
            let amp_channel2 = self.channel2.get_amplitude();
            let amp_channel3 = self.channel3.get_amplitude();
            let amp_channel4 = self.channel4.get_amplitude();
            let left_sample =
                self.left
                    .mix_outputs(amp_channel1, amp_channel2, amp_channel3, amp_channel4);
            let right_sample =
                self.right
                    .mix_outputs(amp_channel1, amp_channel2, amp_channel3, amp_channel4);

            self.buffer[self.buffer_position] = left_sample; // Left
            self.buffer[self.buffer_position + 1] = right_sample; // Right

            self.buffer_position += 2;
        }

        // Full buffer
        if self.buffer_position >= AUDIO_BUFFER_SIZE {
            self.audio_device.queue(self.buffer.as_ref());
            self.buffer_position = 0;
        }
    }

    fn is_writable(&self, address: u16) -> bool {
        // If APU is disabled, only writes to NRx1 length registers, NR52 (to enable APU again) and Wave RAM are enabled
        if self.enabled {
            return true;
        }

        if [R_NR52, R_NR11, R_NR21, R_NR31, R_NR41].contains(&address) {
            return true;
        }

        if (WAVE_PATTERN_RAM_START..=WAVE_PATTERN_RAM_END).contains(&address) {
            return true;
        }

        false
    }
}

impl MemoryAccess for Apu {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_NR50 => {
                (self.left.vin as u8) << 7
                    | self.left.volume << 4
                    | (self.right.vin as u8) << 3
                    | self.right.volume
            }
            R_NR51 => (self.left.enabled_channels.bits() << 4) | self.right.enabled_channels.bits(),
            R_NR52 => {
                ((self.enabled as u8) << 7)
                    | 0b0111_0000
                    | ((self.channel4.channel_enabled as u8) << 3)
                    | ((self.channel3.channel_enabled as u8) << 2)
                    | ((self.channel2.channel_enabled as u8) << 1)
                    | (self.channel1.channel_enabled as u8)
            }
            R_NR10 | R_NR11 | R_NR12 | R_NR13 | R_NR14 => self.channel1.read_byte(address),
            R_NR21..=R_NR24 => self.channel2.read_byte(address),
            R_NR30..=R_NR34 | WAVE_PATTERN_RAM_START..=WAVE_PATTERN_RAM_END => {
                self.channel3.read_byte(address)
            }
            R_NR41..=R_NR44 => self.channel4.read_byte(address),
            _ => panic!(get_invalid_address("APU (read)", address)),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        if !self.is_writable(address) {
            return;
        }

        let next_step_is_length = (self.frame_sequencer.get_step() + 1) & 1 == 1;

        match address {
            R_NR50 => {
                self.left.vin = value & 0b1000_0000 > 0;
                self.left.volume = (value & 0b0111_0000) >> 4;
                self.right.vin = value & 0b0000_1000 > 0;
                self.right.volume = value & 0b0000_0111;
            }
            R_NR51 => {
                self.left.enabled_channels =
                    EnabledChannels::from_bits_truncate((value & 0xf0) >> 4);
                self.right.enabled_channels = EnabledChannels::from_bits_truncate(value & 0x0f);
            }
            R_NR52 => {
                let was_enabled = self.enabled;
                let enabled = (value & 0b1000_0000) > 0;

                // on -> off
                if was_enabled && !enabled {
                    [
                        (R_NR10..=R_NR14),
                        (R_NR21..=R_NR24),
                        (R_NR30..=R_NR34),
                        (R_NR41..=R_NR44),
                        // Wave RAM is untouched
                    ]
                    .iter()
                    .for_each(|range| {
                        range.clone().for_each(|addr| self.write_byte(addr, 0x00));
                    });
                    self.write_byte(R_NR50, 0x00);
                    self.write_byte(R_NR51, 0x00);

                    self.frame_sequencer.reset();
                    // self.cycles = 0; // TODO check this
                }
                // At the end so it won't disable writes to registers
                self.enabled = enabled;
            }
            R_NR10 | R_NR11 | R_NR12 | R_NR13 | R_NR14 => {
                self.channel1
                    .write_byte(address, value, next_step_is_length, self.enabled)
            }
            R_NR21 | R_NR22 | R_NR23 | R_NR24 => {
                self.channel2
                    .write_byte(address, value, next_step_is_length, self.enabled)
            }
            R_NR30
            | R_NR31
            | R_NR32
            | R_NR33
            | R_NR34
            | WAVE_PATTERN_RAM_START..=WAVE_PATTERN_RAM_END => {
                self.channel3
                    .write_byte(address, value, next_step_is_length)
            }
            R_NR41 | R_NR42 | R_NR43 | R_NR44 => {
                self.channel4
                    .write_byte(address, value, next_step_is_length)
            }
            _ => panic!(get_invalid_address("APU (write)", address)),
        }
    }
}
