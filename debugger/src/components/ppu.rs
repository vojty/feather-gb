use eframe::egui::{self};
use gb::emulator::Emulator;

pub struct Ppu;

impl Ppu {
    pub fn new() -> Self {
        Self {}
    }

    pub fn show(&mut self, ctx: &egui::CtxRef, open: &mut bool, e: &Emulator) {
        egui::Window::new("PPU").open(open).show(ctx, |ui| {
            ui.label(format!("Mode: {}", e.hw.ppu.mode));
            ui.label(format!("Line: {}", e.hw.ppu.line));
            ui.horizontal(|ui| {
                ui.label(format!("Line clocks: {}", e.hw.ppu.line_clocks));
            });
        });
    }
}
