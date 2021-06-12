#[derive(PartialEq, Clone, Copy)]
enum SweepDirection {
    Increase,
    Decrease,
}

impl SweepDirection {
    fn bit(&self) -> u8 {
        match &self {
            SweepDirection::Increase => 0,
            SweepDirection::Decrease => 1,
        }
    }

    fn from_bits(bits: u8) -> Self {
        if bits & 0b0000_1000 == 0 {
            SweepDirection::Increase
        } else {
            SweepDirection::Decrease
        }
    }
}

pub struct Sweep {
    pub time: u8, // The period in which one sweep step should take place
    direction: SweepDirection,
    shift: u8, // The amount by which the shadow frequency should be shifted

    enabled: bool,
    frequency: u16,
    pub timer: u8,
    last_calculation_was_decrease: bool,
}

const SWEEP_MAX_PERIOD: u8 = 8;

/**
* Sweep periodically adjusts the frequency of a channel
*/
impl Sweep {
    pub fn new() -> Self {
        Self {
            direction: SweepDirection::Increase,
            shift: 0,
            time: 0,

            enabled: false,
            timer: 0,
            frequency: 0,
            last_calculation_was_decrease: false,
        }
    }

    fn reload_timer(&mut self) {
        self.timer = if self.time > 0 {
            self.time
        } else {
            SWEEP_MAX_PERIOD
        };
    }

    pub fn tick(&mut self) -> bool {
        if !self.enabled {
            return false;
        }

        if self.timer > 0 {
            self.timer -= 1;
        }

        let reset = self.timer == 0;

        if reset {
            // Restart sweep timer
            self.reload_timer();
        }

        reset
    }

    pub fn get_shift(&self) -> u8 {
        self.shift
    }

    pub fn set_frequency(&mut self, frequency: u16) {
        self.frequency = frequency;
    }

    pub fn calculate_frequency(&mut self) -> u16 {
        let diff = (self.frequency >> self.shift) as u16;
        if self.direction == SweepDirection::Increase {
            return self.frequency + diff;
        }
        self.last_calculation_was_decrease = true;
        self.frequency - diff
    }

    pub fn read_byte(&self) -> u8 {
        0b1000_0000 | self.time << 4 | self.direction.bit() << 3 | self.shift
    }

    pub fn trigger(&mut self, frequency: u16) {
        self.frequency = frequency;
        self.enabled = self.time > 0 || self.shift > 0;
        self.last_calculation_was_decrease = false;
        self.reload_timer();
    }

    pub fn write_byte(&mut self, bits: u8) -> bool {
        let prev_direction = self.direction;
        self.time = (bits & 0b0111_0000) >> 4;
        self.direction = SweepDirection::from_bits(bits);
        self.shift = bits & 0b0000_0111;

        // https://gist.github.com/drhelius/3652407#file-game-boy-sound-operation-L467-L471
        let disable_channel = prev_direction == SweepDirection::Decrease
            && self.direction == SweepDirection::Increase
            && self.last_calculation_was_decrease;

        disable_channel
    }
}
