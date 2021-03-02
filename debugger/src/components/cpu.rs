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
                REGISTERS.iter().for_each(|reg| {
                    ui.style_mut().body_text_style = TextStyle::Body;
                    ui.label(reg.to_string());
                    ui.style_mut().body_text_style = TextStyle::Monospace;
                    ui.label(e.cpu.read_reg8(*reg).to_hex());
                });
            });

            ui.label("Flags");
            ui.horizontal(|ui| {
                ui.style_mut().body_text_style = TextStyle::Monospace;
                ui.label(format!("{}", e.cpu.f));
            });

            ui.horizontal(|ui| {
                ui.label(format!("Frames: {}", e.frames));
                ui.label(format!("Frame cycles: {}", e.cpu.frame_cycles));
                ui.label(format!("Cycles: {}", e.cpu.total_cycles));
            });
        });
    }
}
