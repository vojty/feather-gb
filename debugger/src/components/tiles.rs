use eframe::{
    egui::{self, Color32, TextureId, Vec2},
    epi,
};
use egui::Ui;
use gb::{constants::TILE_SIZE, emulator::Emulator};

use crate::canvas::Canvas;

use super::scale::render_scale;

pub struct Tiles {
    scale: usize,
    canvas: Canvas,
    tiles_width: usize,
    tiles_height: usize,
    texture_id: TextureId,
    texture_hash: u64,
}

impl Default for Tiles {
    fn default() -> Self {
        let scale = 2;
        let tiles_width = TILES_PER_LINE * TILE_SIZE;
        let tiles_height = 24 * TILE_SIZE;

        Tiles {
            texture_id: TextureId::default(),
            texture_hash: 0,
            scale,
            tiles_height,
            tiles_width,
            canvas: Canvas::new(tiles_width, tiles_height, scale),
        }
    }
}

const TILES_PER_LINE: usize = 16;

const C1: Color32 = Color32::from_rgb(255, 255, 255);
const C2: Color32 = Color32::from_rgb(192, 192, 192);
const C3: Color32 = Color32::from_rgb(96, 96, 96);
const C4: Color32 = Color32::from_rgb(0, 0, 0);

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
        let size = Vec2::new(
            (self.tiles_width * self.scale) as f32,
            (self.tiles_height * self.scale) as f32,
        );

        if hash != self.texture_hash {
            tex_allocator.free(self.texture_id);

            for ty in 0..self.tiles_height {
                for tx in 0..self.tiles_width {
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

        if self.canvas.get_scale() != self.scale {
            // Invalidate texture cache & create new resized canvas
            self.texture_hash = 0;
            self.canvas.resize(self.scale);
        }
    }
}
