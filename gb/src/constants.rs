pub const DISPLAY_HEIGHT: usize = 144;
pub const DISPLAY_WIDTH: usize = 160;
pub const PIXELS: usize = DISPLAY_HEIGHT * DISPLAY_WIDTH;

// FPS = 59.7275
// CPU_CLOCK_SPEED = 4194304
// CPU_CLOCK_SPEED / FPS
// pub const CYCLES_PER_FRAME: u32 = 70224;
pub const CPU_CLOCK_SPEED: usize = 4194304;

pub const TILE_SIZE: usize = 8;
pub const TILE_WIDTH: usize = 8;
pub const SPRITES_COUNT: usize = 40;
pub const SPRITES_PER_LINE: usize = 10;

pub const AUDIO_BUFFER_SIZE: usize = 2048;

// GB APU outputs every M cycle, so basically the sample rate of GB is 4 MHz
// FOr better audio it's recommended to collect samples at higher rate and downsample them to 44.1 kHz with a resampler (cubic for example)
// pub const AUDIO_SAMPLE_RATE: usize = 262144;
// pub const AUDIO_SAMPLE_RATE: usize = 65536;
pub const AUDIO_SAMPLE_RATE: usize = 44100;
// pub const AUDIO_SAMPLE_RATE: usize = 10000;

pub const AUDIO_CYCLES_PER_SAMPLE: usize = CPU_CLOCK_SPEED / AUDIO_SAMPLE_RATE; // take sample per every 16 cycles
