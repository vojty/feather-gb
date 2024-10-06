#[derive(PartialEq)]
enum EnvelopeDirection {
    Decrease,
    Increase,
}

impl EnvelopeDirection {
    fn bit(&self) -> u8 {
        match &self {
            EnvelopeDirection::Decrease => 0,
            EnvelopeDirection::Increase => 1,
        }
    }
    fn from_bits(bits: u8) -> Self {
        if bits & 0b0000_1000 == 0 {
            EnvelopeDirection::Decrease
        } else {
            EnvelopeDirection::Increase
        }
    }
}

/**
 * Periodically adjusts the volume
 * Unsed in Channels 1,2 & 4
 */
pub struct VolumeEnvelope {
    initial_volume: u8, // Bit 7-4 - Initial Volume of envelope (0-0Fh) (0=No Sound)
    direction: EnvelopeDirection, // Bit 3   - Envelope Direction (0=Decrease, 1=Increase)
    periods: u8,        // Bit 2-0 - Number of envelope sweep (n: 0-7) (0=Stop)

    timer: u8,
    current_volume: u8, // from 0-15
}

impl VolumeEnvelope {
    pub fn new() -> Self {
        Self {
            initial_volume: 0,
            direction: EnvelopeDirection::Decrease,
            periods: 0,
            timer: 0,
            current_volume: 0,
        }
    }

    pub fn reset(&mut self) {
        self.current_volume = self.initial_volume;
        self.timer = self.periods;
    }

    fn adjust_volume(&mut self) {
        match self.direction {
            EnvelopeDirection::Increase => {
                if self.current_volume < 0xf {
                    self.current_volume += 1;
                }
            }
            EnvelopeDirection::Decrease => {
                if self.current_volume > 0 {
                    self.current_volume -= 1;
                }
            }
        }
    }

    pub fn tick(&mut self) {
        // no periods = disabled
        if self.periods == 0 {
            return;
        }

        // Decrement counter
        if self.timer > 0 {
            self.timer -= 1;
        }

        // Reset counter
        if self.timer == 0 {
            self.timer = self.periods;
            self.adjust_volume();
        }
    }

    pub fn get_current_volume(&self) -> u8 {
        self.current_volume
    }

    pub fn read_byte(&self) -> u8 {
        (self.initial_volume << 4) | (self.direction.bit() << 3) | self.periods
    }

    pub fn write_byte(&mut self, bits: u8) {
        self.initial_volume = bits >> 4;
        self.direction = EnvelopeDirection::from_bits(bits);
        self.periods = bits & 0b111;
    }
}
