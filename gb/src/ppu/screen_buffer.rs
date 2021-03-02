use crate::constants::{DISPLAY_WIDTH, PIXELS};

use super::ppu::RGB;
#[derive(PartialEq)]
enum ActiveBuffer {
    Front,
    Back,
}

pub struct Buffer {
    data: Box<[RGB; PIXELS]>,
}

fn get_offset(x: usize, y: usize) -> usize {
    y * DISPLAY_WIDTH + x
}

impl Buffer {
    fn new() -> Self {
        Self {
            data: Box::new([RGB::empty(); PIXELS]),
        }
    }
    pub fn get_pixel(&self, x: usize, y: usize) -> &RGB {
        &self.data[get_offset(x, y)]
    }

    pub fn set_pixel(&mut self, x: usize, y: usize, pixel: RGB) {
        self.data[get_offset(x, y)] = pixel;
    }

    pub fn clear(&mut self) {
        self.data = Box::new([RGB::empty(); PIXELS]);
    }

    pub fn clear_with(&mut self, pixel: RGB) {
        self.data = Box::new([pixel; PIXELS]);
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

    // Direct pointer so we won't copy the whole buffer when recieving data in wasm world
    // pub fn get_data_ptr(&self) -> *const RGB {
    //     self.get_buffer().as_ptr()
    // }
}
