pub const DISPLAY_HEIGHT: usize = 144;
pub const DISPLAY_WIDTH: usize = 160;
pub const PIXELS: usize = DISPLAY_HEIGHT * DISPLAY_WIDTH;

// FPS = 59.7275
// CPU_CLOCK_SPEED = 4194304
// CPU_CLOCK_SPEED / FPS
pub const CYCLES_PER_FRAME: u32 = 70224;
pub const CPU_CLOCK_SPEED: usize = 4194304;

pub const TILE_SIZE: usize = 8;
pub const TILE_WIDTH: usize = 8;
pub const SPRITES_COUNT: usize = 40;
