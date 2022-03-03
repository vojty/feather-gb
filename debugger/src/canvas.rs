use eframe::{
    egui::Color32,
    epaint::{ColorImage, Vec2},
};

pub struct Canvas {
    width: usize,
    height: usize,
    scale: usize,
    pixels: Vec<Color32>,
}

fn create_pixels(size: usize) -> Vec<Color32> {
    vec![Color32::default(); size]
}

fn get_size(width: usize, height: usize, scale: usize) -> usize {
    width * scale * height * scale
}

impl Canvas {
    pub fn new(width: usize, height: usize, scale: usize) -> Self {
        let size = get_size(width, height, scale);
        let pixels = create_pixels(size);
        Self {
            width,
            height,
            scale,
            pixels,
        }
    }

    fn get_line_width(&self) -> usize {
        self.scale * self.width
    }

    fn reset_pixels(&mut self) {
        let size = get_size(self.width, self.height, self.scale);
        self.pixels = create_pixels(size);
    }

    pub fn resize_scale(&mut self, scale: usize) {
        self.scale = scale;
        self.reset_pixels();
    }

    pub fn resize_height(&mut self, height: usize) {
        self.height = height;
        self.reset_pixels();
    }

    pub fn set_pixel(&mut self, x: usize, y: usize, pixel: Color32) {
        let line_width = self.get_line_width();
        let index = x * self.scale + y * line_width * self.scale;

        // Scale
        for scaled_y in 0..self.scale {
            for scaled_x in 0..self.scale {
                let scaled_index = index + (scaled_y * line_width) + scaled_x;
                self.pixels[scaled_index] = pixel;
            }
        }
    }

    pub fn get_scale(&self) -> usize {
        self.scale
    }

    pub fn get_height(&self) -> usize {
        self.height
    }

    pub fn get_width(&self) -> usize {
        self.width
    }

    pub fn get_scaled_size(&self) -> [usize; 2] {
        [self.width * self.scale, self.height * self.scale]
    }
    pub fn get_scaled_size_vec2(&self) -> Vec2 {
        Vec2 {
            x: (self.width * self.scale) as f32,
            y: (self.height * self.scale) as f32,
        }
    }

    pub fn create_image(&self) -> ColorImage {
        ColorImage {
            size: self.get_scaled_size(),
            pixels: self.pixels.clone(),
        }
    }
}
