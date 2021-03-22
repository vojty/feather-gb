use crate::constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH, PIXELS};

use super::ppu::RGB;
#[derive(PartialEq)]
enum ActiveBuffer {
    Front,
    Back,
}

const PIXEL_DATA_SIZE: usize = PIXELS * 3;

// Stored as an array so we can use pointer to the JS world
pub struct Buffer {
    data: Box<[u8; PIXEL_DATA_SIZE]>,
}

fn get_offset(x: usize, y: usize) -> usize {
    (y * DISPLAY_WIDTH + x) * 3
}

impl Buffer {
    fn new() -> Self {
        Self {
            data: Box::new([0; PIXEL_DATA_SIZE]),
        }
    }

    pub fn get_pixel(&self, x: usize, y: usize) -> RGB {
        let offset = get_offset(x, y);
        RGB {
            r: self.data[offset],
            g: self.data[offset + 1],
            b: self.data[offset + 2],
        }
    }

    pub fn set_pixel(&mut self, x: usize, y: usize, pixel: RGB) {
        let offset = get_offset(x, y);

        self.data[offset] = pixel.r;
        self.data[offset + 1] = pixel.g;
        self.data[offset + 2] = pixel.b;
    }

    pub fn clear(&mut self) {
        self.data = Box::new([0; PIXEL_DATA_SIZE]);
    }

    pub fn clear_with(&mut self, pixel: RGB) {
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
