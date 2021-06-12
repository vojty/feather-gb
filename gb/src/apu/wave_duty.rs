// 0b00 - 12.5%
//  ┌───────┐ ┌───────┐ ┌───────
// ─┘       └─┘       └─┘

// 0b01 - 25%
//   ┌──────┐  ┌──────┐  ┌──────
// ──┘      └──┘      └──┘

// 0b10 - 50%
//     ┌────┐    ┌────┐    ┌────
// ────┘    └────┘    └────┘

// 0b11 - 75%
//       ┌──┐      ┌──┐      ┌──
// ──────┘  └──────┘  └──────┘

type Pattern = [u8; 8];

const WAVE_DUTY_PATTERNS: [Pattern; 4] = [
    [0, 0, 0, 0, 0, 0, 0, 1], // 12.5%
    [1, 0, 0, 0, 0, 0, 0, 1], // 25%
    [1, 0, 0, 0, 0, 1, 1, 1], // 50%
    [0, 1, 1, 1, 1, 1, 1, 0], // 75%
];

enum WavePatternDuty {
    Duty12_5,
    Duty25,
    Duty50,
    Duty75,
}

impl WavePatternDuty {
    fn get_pattern(&self) -> Pattern {
        let index = self.bits() as usize;
        WAVE_DUTY_PATTERNS[index]
    }

    fn bits(&self) -> u8 {
        match self {
            WavePatternDuty::Duty12_5 => 0b00,
            WavePatternDuty::Duty25 => 0b01,
            WavePatternDuty::Duty50 => 0b10,
            WavePatternDuty::Duty75 => 0b11,
        }
    }

    fn from_bits(bits: u8) -> Self {
        match bits {
            0b00 => Self::Duty12_5,
            0b01 => Self::Duty25,
            0b10 => Self::Duty50,
            0b11 => Self::Duty75,
            _ => panic!("Cannot create WaveDutyPattern from bits={}", bits),
        }
    }
}

pub struct WaveDuty {
    duty: WavePatternDuty,
    wave_position: usize,
}

impl WaveDuty {
    pub fn new() -> Self {
        Self {
            duty: WavePatternDuty::from_bits(0),
            wave_position: 0,
        }
    }

    pub fn tick(&mut self) {
        self.wave_position += 1;
        if self.wave_position >= 8 {
            self.wave_position = 0;
        }
    }

    pub fn get_data(&self) -> u8 {
        let pattern = self.duty.get_pattern();
        pattern[self.wave_position]
    }

    pub fn read_byte(&self) -> u8 {
        self.duty.bits() << 6 | 0b0011_1111
    }

    pub fn write_byte(&mut self, bits: u8) {
        self.duty = WavePatternDuty::from_bits((bits & 0b1100_0000) >> 6);
    }
}
