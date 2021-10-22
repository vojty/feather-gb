use eframe::{
    egui::{self},
    epi,
};
use egui::{Color32, TextStyle, Vec2};
use gb::{
    audio::AudioDevice, cartridges::cartridge::Cartridge, emulator::Emulator, traits::DisplayHex,
};
use size_format::SizeFormatterBinary;
use std::sync::mpsc::Receiver;

use crate::{
    components::{
        cpu::Cpu, disassembly::Disassembly, display::Display, frame_history::FrameHistory,
        joypad::handle_inputs, maps::Maps, memory_viewer::MemoryViewer, ppu::Ppu, roms::Roms,
        tiles::Tiles,
    },
    utils::BinarySource,
};

struct Components {
    roms: Roms,
    tiles: Tiles,
    memory_viewer: MemoryViewer,
    frame_history: FrameHistory,
    display: Display,
    maps: Maps,
    cpu: Cpu,
    ppu: Ppu,
    disassembly: Disassembly,
}

type RomData = Vec<u8>;

pub struct Debugger {
    emulator: Emulator,
    running: bool,
    speed: u8,

    file_receiver: Option<Receiver<RomData>>,

    components: Components,
}

struct DummyAudio;

impl AudioDevice for DummyAudio {
    fn queue(&mut self, _buffer: &[f32]) {
        // TODO
    }
}

impl Debugger {
    pub fn new(roms: Vec<Box<dyn BinarySource>>) -> Self {
        let cartridge = Cartridge::empty();
        Self {
            file_receiver: None,
            speed: 1,
            emulator: Emulator::new(true, cartridge, Box::new(DummyAudio {})),
            running: false,
            components: Components {
                disassembly: Disassembly::new(),
                display: Display::new(),
                frame_history: FrameHistory::new(),
                tiles: Tiles::default(),
                roms: Roms::new(roms),
                memory_viewer: MemoryViewer::default(),
                maps: Maps::new(),
                cpu: Cpu::new(),
                ppu: Ppu::new(),
            },
        }
    }
}

impl epi::App for Debugger {
    fn name(&self) -> &str {
        "GameBoy emulator - Debugger"
    }

    /// Called each time the UI needs repainting, which may be many times per second.
    /// Put your widgets into a `SidePanel`, `TopPanel`, `CentralPanel`, `Window` or `Area`.
    fn update(&mut self, ctx: &egui::CtxRef, frame: &mut epi::Frame<'_>) {
        let Debugger {
            running,
            emulator,
            components,
            speed,
            file_receiver,
        } = self;
        let cpu_usage = frame.info().cpu_usage;
        let tex_allocator = frame.tex_allocator();

        // ------------------ INPUTS ----------------------
        handle_inputs(emulator, ctx);

        // ------------------ ROM load ----------------------
        if let Some(receiver) = file_receiver {
            if let Ok(result) = receiver.try_recv() {
                *file_receiver = None;
                *emulator = Emulator::new(
                    false,
                    Cartridge::from_bytes(&result),
                    Box::new(DummyAudio {}),
                );
            }
        }

        egui::SidePanel::left("side_panel").show(ctx, |ui| {
            ui.heading("GameBoy DMG Emulator");
            ui.label(format!("FPS: {:.1}", components.frame_history.fps()));
            if ui.button("Organize windows").clicked() {
                ui.ctx().memory().reset_areas();
            }

            ui.separator();

            // ------------------ CONTROLS ----------------------
            ui.heading("Controls");
            let label = if *running { "Stop" } else { "Start" };
            if ui.button(label).clicked() {
                *running = !*running;
            }

            ui.horizontal(|ui| {
                ui.label("Emulation speed");
                for i in 1..5 {
                    ui.selectable_value(speed, i, format!("{}x", i));
                }
            });
            ui.end_row();

            if ui.button("Next instruction").clicked() {
                emulator.run_instruction();
            }

            if ui.button("Step").clicked() {
                emulator.run_instruction();
            }

            if ui.button("Next frame").clicked() {
                emulator.run_frame();
            }
            ui.separator();

            // ------------------ CARTRIDGE INFO ----------------------
            ui.heading("Cartridge");
            let meta = &emulator.hw.cartridge.meta;
            ui.label(format!("Name: {}", meta.get_name(),));
            ui.label(format!(
                "Type: {} (0x{})",
                meta.cartridge_type,
                meta.cartridge_type_byte.to_hex(),
            ));
            ui.label(format!(
                "ROM={:.0}B, RAM={:.0}B",
                SizeFormatterBinary::new(meta.rom_size as u64),
                SizeFormatterBinary::new(meta.ram_size as u64)
            ));
            ui.label(format!("CGB Flag: {}", meta.cgb_flag));
            ui.separator();

            // ------------------ SERIAL ----------------------
            ui.with_layout(egui::Layout::bottom_up(egui::Align::Center), |ui| {
                ui.style_mut().body_text_style = TextStyle::Monospace;
                ui.add(
                    egui::Hyperlink::new("https://github.com/emilk/egui/").text("powered by egui"),
                );
            });
        });

        if *running {
            // Run frame
            for _ in 0..*speed {
                emulator.run_frame();
            }
        }

        // ------------------ GB DISPLAY ----------------------
        components.display.show(ctx, emulator, tex_allocator);

        egui::CentralPanel::default().show(ctx, |ui| {
            egui::warn_if_debug_build(ui);
        });

        // ------------------ TILES ----------------------
        components
            .tiles
            .show(ctx, &mut true, emulator, tex_allocator);

        // ------------------ MEMORY ----------------------
        components.memory_viewer.show(ctx, emulator, &mut true);

        // ------------------ MAPS ----------------------
        components
            .maps
            .show(ctx, &mut true, emulator, tex_allocator);

        // ------------------ FPS ----------------------
        components
            .frame_history
            .on_new_frame(ctx.input().time, cpu_usage);

        // ------------------ ROMS ----------------------
        components.roms.show(ctx, &mut true, |rom| {
            let (sender, receiver) = std::sync::mpsc::channel();
            *file_receiver = Some(receiver);
            rom.get_binary(Box::new(move |loaded: Vec<u8>| {
                sender.send(loaded).unwrap();
            }));
        });

        // ------------------ CPU ----------------------
        components.cpu.show(ctx, &mut true, emulator);

        // ------------------ PPU ----------------------
        components.ppu.show(ctx, &mut true, emulator);

        // ------------------ DISASSEMBLY ----------------------
        components.disassembly.show(ctx, &mut true, emulator);

        // Continuous mode
        ctx.request_repaint();
    }

    fn warm_up_enabled(&self) -> bool {
        false
    }

    fn save(&mut self, _storage: &mut dyn epi::Storage) {}

    fn on_exit(&mut self) {}

    fn auto_save_interval(&self) -> std::time::Duration {
        std::time::Duration::from_secs(30)
    }

    fn max_size_points(&self) -> egui::Vec2 {
        Vec2::new(2000.0, 2000.0)
    }

    fn clear_color(&self) -> egui::Rgba {
        // NOTE: a bright gray makes the shadows of the windows look weird.
        Color32::from_rgb(12, 12, 12).into()
    }
}
