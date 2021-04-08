use eframe::egui::{
    show_tooltip_at_pointer, Color32, CtxRef, Grid, Id, Pos2, Sense, Stroke, Ui, Vec2, Window,
};
use gb::{
    constants::DISPLAY_HEIGHT,
    emulator::Emulator,
    ppu::{
        registers::{R_BGP, R_LCDC, R_LY, R_LYC, R_OBP0, R_OBP1, R_SCX, R_SCY, R_STAT, R_WX, R_WY},
        screen_buffer::{LineStats, LineStatsData},
    },
    traits::{DisplayHex, MemoryAccess},
};

use crate::ui_extensions::ExtendedUi;

pub struct Ppu {}

fn format_interval(from: u32, to: u32) -> String {
    format!("{:>3} -> {:>3}", from, to)
}

const COLOR_OAM_SEARCH: Color32 = Color32::from_rgb(243, 201, 74);
const COLOR_PIXEL_TRANSFER: Color32 = Color32::from_rgb(243, 114, 74);
const COLOR_H_BLANK: Color32 = Color32::from_rgb(74, 243, 102);
const COLOR_V_BLANK: Color32 = Color32::from_rgb(74, 227, 243);

impl Ppu {
    pub fn new() -> Self {
        Self {}
    }

    pub fn show(&mut self, ctx: &CtxRef, open: &mut bool, e: &Emulator) {
        Window::new("PPU").open(open).show(ctx, |ui| {
            ui.heading("Internals");

            Grid::new("Internals").show(ui, |ui| {
                ui.label("Mode");
                ui.mono_label(e.hw.ppu.mode);
                ui.end_row();

                ui.label("Line");
                ui.mono_label(e.hw.ppu.line);
                ui.end_row();

                ui.label("LY to compare");
                ui.mono_label(match e.hw.ppu.ly_to_compare {
                    Some(ly) => ly.to_string(),
                    None => String::from("None"),
                });
                ui.end_row();

                ui.label("STAT interrupt line");
                ui.mono_label(e.hw.ppu.prev_stat_flag as u32);
                ui.end_row();

                ui.label("Line clocks");
                ui.mono_label(e.hw.ppu.line_clocks);
                ui.end_row();
            });

            ui.separator();
            ui.label("Frame timing diagram");
            let stats = e.hw.ppu.get_screen_buffer().get_stats();

            let (rect, response) = ui.allocate_exact_size(Vec2::new(456.0, 153.0), Sense::hover());
            let base = rect.left_top();

            if e.frames > 0 {
                if response.hovered() {
                    if let Some(screen_position) = ui.input().pointer.hover_pos() {
                        let canvas_pos = screen_position - base;
                        let line = canvas_pos.y.round() as usize;
                        if line < DISPLAY_HEIGHT {
                            let line_stats = &stats[line];
                            self.render_line_tooltip(ui, line, line_stats);
                        }
                    }
                }
                self.render_lines(ui, stats, base);
            }

            ui.separator();

            ui.heading("Registers");
            Grid::new("PPU Registers").show(ui, |ui| {
                let registers = [
                    ("IF", 0xff0f, e.hw.read_byte(0xff0f)),
                    ("LCDC", R_LCDC, e.hw.read_byte(R_LCDC)),
                    ("STAT", R_STAT, e.hw.read_byte(R_STAT)),
                    ("SCY", R_SCY, e.hw.read_byte(R_SCY)),
                    ("SCX", R_SCX, e.hw.read_byte(R_SCX)),
                    ("LY", R_LY, e.hw.read_byte(R_LY)),
                    ("LYC", R_LYC, e.hw.read_byte(R_LYC)),
                    ("BGP", R_BGP, e.hw.read_byte(R_BGP)),
                    ("OBP0", R_OBP0, e.hw.read_byte(R_OBP0)),
                    ("OBP1", R_OBP1, e.hw.read_byte(R_OBP1)),
                    ("WY", R_WY, e.hw.read_byte(R_WY)),
                    ("WX", R_WX, e.hw.read_byte(R_WX)),
                ];

                registers.iter().for_each(|(name, address, value)| {
                    ui.mono_label(format!("0x{}", address.to_hex()));
                    ui.label(*name);
                    ui.mono_label(value.to_hex());
                    ui.end_row();
                });
            });
        });
    }

    fn render_lines(&self, ui: &Ui, stats: &LineStatsData, base: Pos2) {
        let stroke_width = 1.0;
        let stroke_oam_search = Stroke::new(stroke_width, COLOR_OAM_SEARCH);
        let stroke_pixel_transfer = Stroke::new(stroke_width, COLOR_PIXEL_TRANSFER);
        let stroke_h_blank = Stroke::new(stroke_width, COLOR_H_BLANK);
        let stroke_v_blank = Stroke::new(stroke_width, COLOR_V_BLANK);
        for (line, line_stats) in stats.iter().enumerate() {
            let line = line as f32;
            ui.painter().line_segment(
                [
                    Pos2::new(base.x + 0.0, base.y + line),
                    Pos2::new(base.x + line_stats.pixel_transfer as f32, base.y + line),
                ],
                stroke_oam_search,
            );
            ui.painter().line_segment(
                [
                    Pos2::new(base.x + line_stats.pixel_transfer as f32, base.y + line),
                    Pos2::new(base.x + line_stats.h_blank as f32, base.y + line),
                ],
                stroke_pixel_transfer,
            );
            ui.painter().line_segment(
                [
                    Pos2::new(base.x + line_stats.h_blank as f32, base.y + line),
                    Pos2::new(base.x + 456.0, base.y + line),
                ],
                stroke_h_blank,
            );
        }
        for line in 144..153 {
            let line = line as f32;
            ui.painter().line_segment(
                [
                    Pos2::new(base.x + 0.0, base.y + line),
                    Pos2::new(base.x + 456.0, base.y + line),
                ],
                stroke_v_blank,
            );
        }
    }

    fn render_line_tooltip(&self, ui: &Ui, line: usize, line_stats: &LineStats) {
        show_tooltip_at_pointer(ui.ctx(), Id::new("PPU line timing tooltip"), |ui| {
            ui.horizontal(|ui| {
                ui.label("Line");
                ui.mono_label(line);
            });

            Grid::new("Line stats").show(ui, |ui| {
                ui.label("OAM Search");
                ui.mono_label(format_interval(0, line_stats.pixel_transfer - 1));
                ui.end_row();

                ui.label("Pixel Transfer");
                ui.mono_label(format_interval(
                    line_stats.pixel_transfer,
                    line_stats.h_blank - 1,
                ));
                ui.end_row();

                ui.label("H-Blank");
                ui.mono_label(format_interval(line_stats.h_blank, 456));
                ui.end_row();
            });
        })
    }
}
