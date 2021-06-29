pub enum FrequencyTimerType {
    Square,
    Wave,
    #[allow(dead_code)]
    Channel4,
}

pub const MAX_FREQUENCY: u16 = 2047;

impl FrequencyTimerType {
    fn calculate_initial_timer(&self, frequency: u16) -> u16 {
        match self {
            FrequencyTimerType::Square => ((MAX_FREQUENCY + 1) - frequency) * 4,
            FrequencyTimerType::Wave => ((MAX_FREQUENCY + 1) - frequency) * 2,
            FrequencyTimerType::Channel4 => todo!(),
        }
    }
}

// Ticks on every T-cycle
// Every channel has to adjust its output when the timer expires
pub struct FrequencyTimer {
    timer_type: FrequencyTimerType,
    timer: u16,
    frequency: u16, // for initial "timer" calculation, this is not frequency of the sound
}

impl FrequencyTimer {
    pub fn new(timer_type: FrequencyTimerType) -> Self {
        Self {
            timer: 0,
            frequency: 0,
            timer_type,
        }
    }

    fn reload_timer(&mut self) {
        self.timer = self.timer_type.calculate_initial_timer(self.frequency);
    }

    pub fn set_frequency_high(&mut self, bits: u8) {
        let high = (bits as u16) & 0b111;
        self.frequency = (self.frequency & 0xff) | high << 8;
    }

    pub fn set_frequency_low(&mut self, bits: u8) {
        self.frequency = (self.frequency & 0b0111_0000_0000) | bits as u16
    }

    pub fn set_frequency(&mut self, frequency: u16) {
        self.frequency = frequency;
    }

    pub fn get_frequency(&self) -> u16 {
        self.frequency
    }

    pub fn tick(&mut self) -> bool {
        if self.timer > 0 {
            self.timer -= 1;
        }

        let reset = self.timer == 0;

        if reset {
            self.reload_timer();
        }

        reset
    }
}
