use eframe::{
    egui::{self, Color32, TextureId},
    epi,
};
use egui::Ui;
use gb::{constants::TILE_SIZE, emulator::Emulator};

use crate::canvas::Canvas;

use super::scale::render_scale;

pub struct Tiles {
    scale: usize,
    canvas: Canvas,
    texture_id: TextureId,
    texture_hash: u64,
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
            texture_id: TextureId::default(),
            texture_hash: 0,
            scale,
            is_cgb,
            canvas,
        }
    }
}

impl Tiles {
    pub fn show(
        &mut self,
        ctx: &egui::CtxRef,
        open: &mut bool,
        e: &Emulator,
        tex_allocator: &mut dyn epi::TextureAllocator,
    ) {
        egui::Window::new("Tiles").open(open).show(ctx, |ui| {
            self.ui(ui, e, tex_allocator);
        });
    }

    pub fn ui(&mut self, ui: &mut Ui, e: &Emulator, tex_allocator: &mut dyn epi::TextureAllocator) {
        let tiles = e.hw.ppu.vram.get_tiles();
        let hash = e.hw.ppu.vram.get_tiles_hash();

        let size = self.canvas.get_scaled_size();

        if hash != self.texture_hash {
            tex_allocator.free(self.texture_id);

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

            self.texture_hash = hash;
            self.texture_id = tex_allocator.alloc_srgba_premultiplied(
                (size.x as usize, size.y as usize),
                self.canvas.get_pixels(),
            );
        }

        render_scale(ui, &mut self.scale);

        ui.image(self.texture_id, size);

        if self.is_cgb != e.is_cgb() {
            // CGB has doubled height (2x more tiles)
            self.is_cgb = e.is_cgb();
            self.texture_hash = 0;
            self.canvas.resize_height(get_canvas_height(e.is_cgb()));
        }

        if self.canvas.get_scale() != self.scale {
            // Invalidate texture cache & create new resized canvas
            self.texture_hash = 0;
            self.canvas.resize_scale(self.scale);
        }
    }
}
