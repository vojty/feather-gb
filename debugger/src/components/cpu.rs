use eframe::egui::TextStyle;
use eframe::egui::{self};
use gb::{cpu::cpu::Reg8, emulator::Emulator, traits::DisplayHex};

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

    pub fn show(&mut self, ctx: &egui::CtxRef, open: &mut bool, e: &Emulator) {
        egui::Window::new("CPU").open(open).show(ctx, |ui| {
            ui.label("Registers");
            ui.horizontal(|ui| {
                REGISTERS.iter().enumerate().for_each(|(i, reg)| {
                    ui.style_mut().body_text_style = TextStyle::Body;
                    ui.label(reg.to_string());
                    ui.style_mut().body_text_style = TextStyle::Monospace;
                    let value = e.cpu.read_reg8(*reg);
                    ui.label(format!("0x{}", value.to_hex()))
                        .on_hover_text(value.to_string());
                    if i < REGISTERS.len() - 1 {
                        ui.separator();
                    }
                });
            });

            ui.label("Flags");
            ui.horizontal(|ui| {
                ui.style_mut().body_text_style = TextStyle::Monospace;
                ui.label(format!("{}", e.cpu.f));
            });

            ui.horizontal(|ui| {
                ui.label(format!("Frames: {}", e.frames));
                ui.separator();
                ui.label(format!("Frame cycles: {}", e.cpu.frame_cycles));
                ui.separator();
                ui.label(format!("Cycles: {}", e.cpu.total_cycles));
            });
        });
    }
}
