use bitflags::bitflags;

pub struct LengthCounter {
    enabled: bool,
    counter: u16,
    max_length: u16,
}

bitflags! {
    pub struct ControlBits: u8 {
        const RESTART = 0b1000_0000;
        const ENABLED = 0b0100_0000;
        const FREQUENCY_HIGH = 0b0000_0111;
    }
}

// A length counter disables a channel when it decrements to zero.
// https://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware#Length_Counter
impl LengthCounter {
    pub fn new(max_length: u16) -> Self {
        Self {
            counter: 0,
            enabled: false,
            max_length,
        }
    }

    pub fn tick(&mut self) -> bool {
        if self.counter > 0 && self.enabled {
            self.counter -= 1;

            if self.counter == 0 {
                return true;
            }
        }
        false
    }

    pub fn get_enabled(&self) -> bool {
        self.enabled
    }

    pub fn is_expired(&self) -> bool {
        self.counter == 0
    }

    pub fn reload(&mut self) {
        self.counter = self.max_length;
    }

    pub fn set_counter(&mut self, counter: u8) {
        self.counter = self.max_length - counter as u16;
    }

    pub fn write_control(&mut self, bits: u8, next_step_is_length: bool) -> (bool, bool) {
        let control_bits = ControlBits::from_bits_truncate(bits);
        let was_enabled = self.enabled;
        self.enabled = control_bits.contains(ControlBits::ENABLED);
        let restart_triggered = control_bits.contains(ControlBits::RESTART);
        let mut should_disable_channel = false;

        // https://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware behavior #5

        if !was_enabled && self.enabled && !next_step_is_length && !self.is_expired() {
            let expired = self.tick();
            if !restart_triggered && expired {
                should_disable_channel = true;
            }
        }

        if restart_triggered && self.is_expired() {
            self.reload();

            if self.enabled && !next_step_is_length {
                self.tick();
            }
        }
        (should_disable_channel, restart_triggered)
    }
}
