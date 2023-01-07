use eframe::egui::{self, Color32, TextureOptions, Ui};
use gb::{constants::TILE_SIZE, emulator::Emulator};

use crate::canvas::Canvas;

use super::scale::render_scale;

pub struct Tiles {
    scale: usize,
    canvas: Canvas,
    is_cgb: bool,
}

const TILES_PER_LINE: usize = 16;

const C1: Color32 = Color32::from_rgb(255, 255, 255);
const C2: Color32 = Color32::from_rgb(192, 192, 192);
const C3: Color32 = Color32::from_rgb(96, 96, 96);
const C4: Color32 = Color32::from_rgb(0, 0, 0);

const BASE_HEIGHT: usize = 24 * TILE_SIZE;

fn get_canvas_height(is_cgb: bool) -> usize {
    if is_cgb {
        return BASE_HEIGHT * 2;
    }
    BASE_HEIGHT
}

impl Default for Tiles {
    fn default() -> Self {
        let scale = 2;
        let is_cgb = false;
        let tiles_width = TILES_PER_LINE * TILE_SIZE;
        let tiles_height = get_canvas_height(is_cgb);
        let canvas = Canvas::new(tiles_width, tiles_height, scale);

        Tiles {
            scale,
            is_cgb,
            canvas,
        }
    }
}

impl Tiles {
    pub fn show(&mut self, ctx: &egui::Context, open: &mut bool, e: &Emulator) {
        egui::Window::new("Tiles").open(open).show(ctx, |ui| {
            self.ui(ui, ctx, e);
        });
    }

    pub fn ui(&mut self, ui: &mut Ui, ctx: &egui::Context, e: &Emulator) {
        let tiles = e.hw.ppu.vram.get_tiles();

        for ty in 0..self.canvas.get_height() {
            for tx in 0..self.canvas.get_width() {
                let tile_x = tx % TILE_SIZE;
                let tile_y = ty % TILE_SIZE;

                let tile_number = tx / TILE_SIZE + (ty / TILE_SIZE) * TILES_PER_LINE;

                let value = tiles[tile_number].get_at(tile_x, tile_y);

                let color = match value {
                    0 => C1,
                    1 => C2,
                    2 => C3,
                    3 => C4,
                    _ => panic!("Undefined tile value {}", value),
                };

                self.canvas.set_pixel(tx, ty, color);
            }
        }

        let image = self.canvas.create_image();
        let texture = ctx.load_texture("tiles", image, TextureOptions::LINEAR);
        ui.image(&texture, self.canvas.get_scaled_size_vec2());

        render_scale(ui, &mut self.scale);

        if self.is_cgb != e.is_cgb() {
            // CGB has doubled height (2x more tiles)
            self.is_cgb = e.is_cgb();
            self.canvas.resize_height(get_canvas_height(e.is_cgb()));
        }

        if self.canvas.get_scale() != self.scale {
            // Invalidate texture cache & create new resized canvas
            self.canvas.resize_scale(self.scale);
        }
    }
}
