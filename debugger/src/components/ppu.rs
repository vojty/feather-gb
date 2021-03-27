use eframe::egui::{self, Grid};
use gb::{
    emulator::Emulator,
    ppu::registers::{R_LCDC, R_STAT},
    traits::{DisplayHex, MemoryAccess},
};

use crate::ui_extensions::ExtendedUi;

pub struct Ppu {
    show_address: bool,
}

impl Ppu {
    pub fn new() -> Self {
        Self { show_address: true }
    }

    pub fn show(&mut self, ctx: &egui::CtxRef, open: &mut bool, e: &Emulator) {
        egui::Window::new("PPU").open(open).show(ctx, |ui| {
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

                ui.label("Line clocks");
                ui.mono_label(e.hw.ppu.line_clocks);
                ui.end_row();
            });

            ui.separator();

            ui.heading("Registers");
            ui.checkbox(&mut self.show_address, "Show address");
            Grid::new("PPU Registers").show(ui, |ui| {
                let registers = [
                    ("LCDC", "ff40", e.hw.read_byte(R_LCDC)),
                    ("STAT", "ff41", e.hw.read_byte(R_STAT)),
                    ("SCX", "ff42", e.hw.ppu.scy),
                    ("SCY", "ff43", e.hw.ppu.scx),
                    ("LY", "ff44", e.hw.ppu.ly),
                    ("LYC", "ff45", e.hw.ppu.lyc),
                    ("BGP", "ff47", e.hw.ppu.bgp),
                    ("OBP0", "ff48", e.hw.ppu.obp0),
                    ("OBP1", "ff49", e.hw.ppu.obp1),
                    ("WY", "ff4a", e.hw.ppu.wy),
                    ("WX", "ff4b", e.hw.ppu.wx),
                ];

                registers.iter().for_each(|(name, address, value)| {
                    if self.show_address {
                        ui.mono_label(*address);
                    }
                    ui.label(*name);
                    ui.mono_label(value.to_hex());
                    ui.end_row();
                });
            })
        });
    }
}
