use std::collections::VecDeque;

use eframe::egui::{CtxRef, Window};
use gb::{
    emulator::Emulator,
    traits::{DisplayHex, MemoryAccess},
};

use crate::opcodes::{OPCODES, OPCODES_CB};
use crate::ui_extensions::mono_label;

pub struct Disassembly;

type Definition = (&'static str, usize); // (name, length)

const VISIBLE_LENGTH: usize = 14;

fn parse_bytes(start_address: u16, size: usize, e: &Emulator) -> Vec<u8> {
    let args: Vec<u8> = (0..size)
        .map(|i| e.hw.read_byte(start_address + (i as u16)))
        .collect();
    args
}

fn get_definition(address: u16, e: &Emulator) -> (Definition, Vec<u8>) {
    let opcode = e.hw.read_byte(address);
    let definition = OPCODES[opcode as usize];
    if opcode != 0xcb {
        return (definition, parse_bytes(address, definition.1, e));
    }
    let opcode = e.hw.read_byte(address + 1);
    let definition = OPCODES_CB[opcode as usize];
    (definition, parse_bytes(address, definition.1, e))
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

        let (definition, _) = get_definition(offset, e);
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

    pub fn show(&mut self, ctx: &CtxRef, open: &mut bool, e: &Emulator) {
        Window::new("Disassembly")
            .resizable(true)
            .default_width(250.0)
            .open(open)
            .show(ctx, |ui| {
                let pc = e.cpu.pc;

                let mut offset = find_start(pc, e);
                for _ in 0..VISIBLE_LENGTH {
                    let (definition, args) = get_definition(offset, e);
                    let (name, length) = definition;

                    let a = args
                        .into_iter()
                        .map(|arg| arg.to_hex())
                        .collect::<Vec<String>>()
                        .join(" ");

                    let mut label =
                        mono_label(format!("0x{} | {:<8} | {:<15}", offset.to_hex(), a, name));
                    if pc == offset {
                        label = label.strong();
                    }
                    ui.add(label);

                    offset += length as u16;
                }
            });
    }
}
