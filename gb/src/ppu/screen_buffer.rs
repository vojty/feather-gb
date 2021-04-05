use crate::constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH, PIXELS};

use super::ppu::{Mode, Rgb};
#[derive(PartialEq)]
enum ActiveBuffer {
    Front,
    Back,
}

const PIXEL_DATA_SIZE: usize = PIXELS * 3;

pub type LineStatsData = [LineStats; DISPLAY_HEIGHT];

#[derive(Clone, Copy)]
pub struct LineStats {
    pub pixel_transfer: u32,
    pub h_blank: u32,
}

impl LineStats {
    fn empty() -> Self {
        Self {
            pixel_transfer: 0,
            h_blank: 0,
        }
    }

    pub fn set_stats(&mut self, mode: Mode, started_at: u32) {
        match mode {
            Mode::HBlank => self.h_blank = started_at,
            Mode::PixelTransfer => self.pixel_transfer = started_at,
            // VBLANK takes up the whole line, OAM starts always at 0 (besides the special first line after turn on)
            _ => panic!("Don't need track cycles for mode {}", mode),
        }
    }
}

// Stored as an array so we can use pointer to the JS world
pub struct Buffer {
    data: Box<[u8; PIXEL_DATA_SIZE]>,
    stats: Box<LineStatsData>,
}

fn get_offset(x: usize, y: usize) -> usize {
    (y * DISPLAY_WIDTH + x) * 3
}

impl Buffer {
    fn new() -> Self {
        Self {
            data: Box::new([0; PIXEL_DATA_SIZE]),
            stats: Box::new([LineStats::empty(); DISPLAY_HEIGHT]),
        }
    }

    pub fn get_pixel(&self, x: usize, y: usize) -> Rgb {
        let offset = get_offset(x, y);
        Rgb {
            r: self.data[offset],
            g: self.data[offset + 1],
            b: self.data[offset + 2],
        }
    }

    pub fn set_pixel(&mut self, x: usize, y: usize, pixel: Rgb) {
        let offset = get_offset(x, y);

        self.data[offset] = pixel.r;
        self.data[offset + 1] = pixel.g;
        self.data[offset + 2] = pixel.b;
    }

    pub fn set_stats(&mut self, mode: Mode, line: usize, started_at: u32) {
        self.stats[line].set_stats(mode, started_at);
    }

    pub fn get_stats(&self) -> &LineStatsData {
        &self.stats
    }

    pub fn clear(&mut self) {
        self.data = Box::new([0; PIXEL_DATA_SIZE]);
    }

    pub fn clear_with(&mut self, pixel: Rgb) {
        for y in 0..DISPLAY_HEIGHT {
            for x in 0..DISPLAY_WIDTH {
                self.set_pixel(x, y, pixel)
            }
        }
    }

    pub fn get_raw_data(&self) -> *const u8 {
        self.data.as_ptr()
    }
}

pub struct ScreenBuffer {
    active: ActiveBuffer,
    front: Buffer,
    back: Buffer,
}

impl ScreenBuffer {
    pub fn new() -> ScreenBuffer {
        ScreenBuffer {
            active: ActiveBuffer::Front,
            front: Buffer::new(),
            back: Buffer::new(),
        }
    }

    pub fn get_read_buffer(&self) -> &Buffer {
        match self.active {
            ActiveBuffer::Front => &self.back,
            ActiveBuffer::Back => &self.front,
        }
    }

    pub fn get_write_buffer_mut(&mut self) -> &mut Buffer {
        match self.active {
            ActiveBuffer::Front => &mut self.front,
            ActiveBuffer::Back => &mut self.back,
        }
    }

    pub fn commit_frame(&mut self) {
        self.active = if self.active == ActiveBuffer::Front {
            ActiveBuffer::Back
        } else {
            ActiveBuffer::Front
        }
    }
}
