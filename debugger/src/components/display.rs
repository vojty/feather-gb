use eframe::egui::{self, Color32, TextureFilter};
use gb::{
    constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH},
    emulator::Emulator,
};

use crate::canvas::Canvas;

use super::scale::render_scale;
pub struct Display {
    scale: usize,
    canvas: Canvas,
}

impl Display {
    pub fn new() -> Self {
        let scale = 2;
        Self {
            scale,
            canvas: Canvas::new(DISPLAY_WIDTH, DISPLAY_HEIGHT, scale),
        }
    }

    pub fn show(&mut self, ctx: &egui::Context, e: &Emulator) {
        egui::Window::new("GameBoy")
            .open(&mut true)
            .resizable(false)
            .collapsible(false)
            .show(ctx, |ui| {
                let buffer = e.get_screen_buffer();
                for y in 0..DISPLAY_HEIGHT {
                    for x in 0..DISPLAY_WIDTH {
                        let pixel = buffer.get_pixel(x, y);
                        let color = Color32::from_rgb(pixel.r, pixel.g, pixel.b);

                        self.canvas.set_pixel(x, y, color);
                    }
                }

                let image = self.canvas.create_image();
                let texture = ctx.load_texture("display", image, TextureFilter::Linear);
                ui.image(&texture, self.canvas.get_scaled_size_vec2());

                render_scale(ui, &mut self.scale);
                if self.canvas.get_scale() != self.scale {
                    // Create new resized canvas
                    self.canvas.resize_scale(self.scale);
                }
            });
    }
}
