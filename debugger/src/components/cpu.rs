use eframe::egui::{self};
use gb::{cpu::cpu::Reg8, emulator::Emulator, traits::DisplayHex};

use crate::ui_extensions::ExtendedUi;

pub struct Cpu;

const REGISTERS: [Reg8; 7] = [
    Reg8::A,
    Reg8::B,
    Reg8::C,
    Reg8::D,
    Reg8::E,
    Reg8::H,
    Reg8::L,
];

impl Cpu {
    pub fn new() -> Self {
        Self {}
    }

    pub fn show(&mut self, ctx: &egui::Context, open: &mut bool, e: &Emulator) {
        egui::Window::new("CPU").open(open).show(ctx, |ui| {
            ui.label("Registers");
            ui.horizontal(|ui| {
                REGISTERS.iter().enumerate().for_each(|(i, reg)| {
                    ui.label(reg.to_string());
                    let value = e.cpu.read_reg8(*reg);
                    ui.mono_label(format!("0x{}", value.to_hex()))
                        .on_hover_text(value.to_string());
                    if i < REGISTERS.len() - 1 {
                        ui.separator();
                    }
                });
            });

            ui.horizontal(|ui| {
                ui.label("PC");
                ui.mono_label(format!("0x{}", e.cpu.pc.to_hex()));

                ui.separator();

                ui.label("SP");
                ui.mono_label(format!("0x{}", e.cpu.sp.to_hex()));
            });

            ui.horizontal(|ui| {
                ui.label("Flags");
                ui.mono_label(e.cpu.f);
            });

            ui.horizontal(|ui| {
                ui.label("Frames");
                ui.mono_label(e.frames);

                ui.separator();

                ui.label("Frame cycles");
                ui.mono_label(e.cpu.frame_cycles);

                ui.separator();

                ui.label("Cycles");
                ui.mono_label(e.cpu.total_cycles);
            });
        });
    }
}
