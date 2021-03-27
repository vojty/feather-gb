use std::collections::VecDeque;

use eframe::egui::{self, Color32};
use gb::{
    emulator::Emulator,
    traits::{DisplayHex, MemoryAccess},
};

use crate::opcodes::{OPCODES, OPCODES_CB};
use crate::ui_extensions::mono_label;

pub struct Disassembly;

type Definition = (&'static str, usize);

const HIGHLIGHT_COLOR: Color32 = Color32::from_rgb(255, 0, 0);

const VISIBLE_LENGTH: usize = 10;

fn get_definition(address: u16, e: &Emulator) -> Definition {
    let opcode = e.hw.read_byte(address);
    let definition = OPCODES[opcode as usize];
    if opcode != 0xcb {
        return definition;
    }
    let opcode = e.hw.read_byte(address + 1);
    let definition = OPCODES_CB[opcode as usize];
    definition
}

fn find_start(pc: u16, e: &Emulator) -> u16 {
    if pc == 0 {
        return 0;
    }

    let mut offset = 0;

    let collect_count = VISIBLE_LENGTH / 2;
    let mut previous = VecDeque::with_capacity(collect_count);

    loop {
        previous.push_back(offset);

        let definition = get_definition(offset, e);
        let (_, bytes_count) = definition;

        offset += bytes_count as u16;

        if previous.len() >= collect_count {
            let first = previous.pop_front();
            if offset >= pc {
                return first.unwrap_or(0);
            }
        }
    }
}

impl Disassembly {
    pub fn new() -> Self {
        Self {}
    }

    pub fn show(&mut self, ctx: &egui::CtxRef, open: &mut bool, e: &Emulator) {
        egui::Window::new("Disassembly")
            .resizable(true)
            .default_width(200.0)
            .open(open)
            .show(ctx, |ui| {
                let pc = e.cpu.pc;

                let mut offset = find_start(pc, e);
                for _ in 0..VISIBLE_LENGTH {
                    let definition = get_definition(offset, e);
                    let (name, length) = definition;

                    let mut label = mono_label(format!("0x{} | {} ", offset.to_hex(), name));
                    if pc == offset {
                        label = label.text_color(HIGHLIGHT_COLOR);
                    }
                    ui.add(label);

                    offset += length as u16;
                }
            });
    }
}
