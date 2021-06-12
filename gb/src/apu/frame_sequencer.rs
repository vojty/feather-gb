// CPU @ 4 MHz
// Frame sequencer @ 512Hz
// 4194304 / 512 = 8192 cycles
// steps 0-7, one step per 8192 cycles
const FRAME_SEQUENCER_MAX_CYCLES: u16 = 8192;
const MAX_STEPS: u8 = 8;

pub struct FrameSequencer {
    cycles: u16,
    step: u8,
}

impl FrameSequencer {
    pub fn new() -> Self {
        Self { cycles: 0, step: 0 }
    }

    pub fn reset(&mut self) {
        self.step = 0;
        self.cycles = 0;
    }

    pub fn get_step(&self) -> u8 {
        self.step
    }

    pub fn tick(&mut self) -> Option<u8> {
        self.cycles += 1;
        // Reset sequencer counter
        if self.cycles == FRAME_SEQUENCER_MAX_CYCLES {
            self.cycles = 0;

            let step_to_process = self.step;

            // Reset step counter
            self.step = if self.step + 1 == MAX_STEPS {
                0
            } else {
                self.step + 1
            };

            return Some(step_to_process);
        }
        None
    }
}
