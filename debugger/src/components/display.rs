use eframe::{
    egui::{self, Color32, TextureId, Vec2},
    epi,
};
use gb::{
    constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH},
    emulator::Emulator,
};

use crate::canvas::Canvas;

use super::scale::render_scale;
pub struct Display {
    scale: usize,
    display_texture: TextureId,
    canvas: Canvas,
}

impl Display {
    pub fn new() -> Self {
        let scale = 2;
        Self {
            scale,
            display_texture: TextureId::default(),
            canvas: Canvas::new(DISPLAY_WIDTH, DISPLAY_HEIGHT, scale),
        }
    }

    pub fn show(
        &mut self,
        ctx: &egui::CtxRef,
        e: &Emulator,
        tex_allocator: &mut dyn epi::TextureAllocator,
    ) {
        egui::Window::new("GameBoy")
            .open(&mut true)
            .resizable(false)
            .collapsible(false)
            .show(ctx, |ui| {
                let scale = self.scale;

                // Clean texture from previous frame
                tex_allocator.free(self.display_texture);

                let size = Vec2::new(
                    (DISPLAY_WIDTH * scale) as f32,
                    (DISPLAY_HEIGHT * scale) as f32,
                );

                let buffer = e.get_screen_buffer();
                for y in 0..DISPLAY_HEIGHT {
                    for x in 0..DISPLAY_WIDTH {
                        let pixel = buffer.get_pixel(x, y);
                        let color = Color32::from_rgb(pixel.r, pixel.g, pixel.b);

                        self.canvas.set_pixel(x, y, color);
                    }
                }

                self.display_texture = tex_allocator.alloc_srgba_premultiplied(
                    (size.x as usize, size.y as usize),
                    self.canvas.get_pixels(),
                );

                render_scale(ui, &mut self.scale);

                // Gameboy
                ui.image(self.display_texture, size);

                if self.canvas.get_scale() != self.scale {
                    // Create new resized canvas
                    self.canvas.resize_scale(self.scale);
                }
            });
    }
}
