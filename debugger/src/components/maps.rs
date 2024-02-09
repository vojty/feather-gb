use eframe::egui::{self, Color32, TextureOptions, Window};
use gb::{
    constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH, TILE_SIZE},
    emulator::Emulator,
    ppu::ppu::MapLayer,
};

use crate::canvas::Canvas;

use super::scale::render_scale;

pub struct Maps {
    scale: usize,
    canvas: Canvas,
    layer: MapLayer,
    show_visible_area: bool,
}

const MAP_WIDTH: usize = 256;
const MAP_HEIGHT: usize = 256;
const TILES_PER_COL: usize = 32; // 256 / 8
const TILES_PER_ROW: usize = 32;

const BORDER: Color32 = Color32::from_rgb(255, 0, 0);

impl Maps {
    pub fn new() -> Self {
        let scale = 1;
        Self {
            scale,
            canvas: Canvas::new(MAP_WIDTH, MAP_HEIGHT, scale),
            layer: MapLayer::Background,
            show_visible_area: true,
        }
    }

    pub fn show(&mut self, ctx: &egui::Context, open: &mut bool, e: &Emulator) {
        Window::new("Maps").open(open).show(ctx, |ui| {
            let palette = e.hw.ppu.get_backround_palette();

            for y in 0..TILES_PER_ROW {
                for x in 0..TILES_PER_COL {
                    let map_index = x + y * TILES_PER_ROW;

                    let tile = e.hw.ppu.get_tile(map_index, self.layer);
                    for ty in 0..TILE_SIZE {
                        for tx in 0..TILE_SIZE {
                            let canvas_x = tx + (x * TILE_SIZE);
                            let canvas_y = ty + (y * TILE_SIZE);

                            let tile_pixel = tile.get_at(tx, ty);
                            let pixel = &palette.colors[tile_pixel as usize];
                            let color = Color32::from_rgb(pixel.r, pixel.g, pixel.b);

                            self.canvas.set_pixel(canvas_x, canvas_y, color)
                        }
                    }
                }
            }

            // Visible area
            if self.show_visible_area {
                self.draw_visible_area(e);
            }

            let image = self.canvas.create_image();
            let texture = ctx.load_texture("maps", image, TextureOptions::LINEAR);
            ui.image((texture.id(), self.canvas.get_scaled_size_vec2()));

            ui.horizontal(|ui| {
                ui.label("Layer");
                ui.selectable_value(&mut self.layer, MapLayer::Background, "Background");
                ui.selectable_value(&mut self.layer, MapLayer::Window, "Window");
            });

            ui.horizontal(|ui| ui.checkbox(&mut self.show_visible_area, "Show visible area"));

            render_scale(ui, &mut self.scale);

            if self.canvas.get_scale() != self.scale {
                // create new resized canvas
                self.canvas.resize_scale(self.scale);
            }
        });
    }

    fn draw_visible_area_bg(&mut self, e: &Emulator) {
        let (scx, scy, enabled) = e.hw.ppu.get_background_pos();

        if !enabled {
            return;
        }

        // Background can overflow and start rendering from start
        let x_lines = match scx.overflowing_add(DISPLAY_WIDTH as u8) {
            (value, false) => vec![(scx..value)],
            (value, true) => vec![(0..value), (scx..255)],
        };
        let y_lines = match scy.overflowing_add(DISPLAY_HEIGHT as u8) {
            (value, false) => vec![(scy..value)],
            (value, true) => vec![(0..value), (scy..255)],
        };

        for x_line in &x_lines {
            for y_line in &y_lines {
                for x in x_line.clone() {
                    self.canvas
                        .set_pixel(x as usize, y_line.start as usize, BORDER);
                    self.canvas
                        .set_pixel(x as usize, y_line.end as usize, BORDER);
                }

                for y in y_line.clone() {
                    self.canvas
                        .set_pixel(x_line.start as usize, y as usize, BORDER);
                    self.canvas
                        .set_pixel(x_line.end as usize, y as usize, BORDER);
                }
            }
        }
    }

    fn draw_visible_area_win(&mut self, e: &Emulator) {
        let (wx, wy, enabled) = e.hw.ppu.get_window_pos();

        let win_x = wx - 7;

        if !enabled
            || !(0..DISPLAY_WIDTH as u8).contains(&win_x)
            || !(0..DISPLAY_HEIGHT as u8).contains(&wy)
        {
            return;
        }

        let x_line = 0..(DISPLAY_WIDTH - win_x as usize);
        let y_line = 0..(DISPLAY_HEIGHT - wy as usize);
        for x in x_line.clone() {
            self.canvas.set_pixel(x, y_line.start, BORDER);
            self.canvas.set_pixel(x, y_line.end, BORDER);
        }
        for y in y_line {
            self.canvas.set_pixel(x_line.start, y, BORDER);
            self.canvas.set_pixel(x_line.end, y, BORDER);
        }
    }

    fn draw_visible_area(&mut self, e: &Emulator) {
        match self.layer {
            MapLayer::Background => self.draw_visible_area_bg(e),
            MapLayer::Window => self.draw_visible_area_win(e),
        }
    }
}
