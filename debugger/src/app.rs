use eframe::{
    egui::{self, TextStyle},
    epaint::{FontFamily, Vec2},
    App, Frame, Storage,
};
use gb::{
    audio::AudioDevice,
    cartridges::cartridge::Cartridge,
    emulator::{Device, Emulator},
    traits::DisplayHex,
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
    device: Device,
    running: bool,
    speed: u8,
    run_until: String,

    rom_data: Option<RomData>,
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
    pub fn new(_cc: &eframe::CreationContext<'_>, roms: Vec<Box<dyn BinarySource>>) -> Self {
        let cartridge = Cartridge::empty();
        let device = Device::AutoDetect;
        Self {
            file_receiver: None,
            rom_data: None,
            speed: 1,
            run_until: String::new(),
            device,
            emulator: Emulator::new(true, cartridge, Box::new(DummyAudio {}), device),
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

impl App for Debugger {
    fn update(&mut self, ctx: &egui::Context, frame: &mut Frame) {
        let Debugger {
            running,
            emulator,
            components,
            speed,
            file_receiver,
            rom_data,
            run_until,
            device,
        } = self;
        let cpu_usage = frame.info().cpu_usage;

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
                    *device,
                );
                *rom_data = Some(result);
            }
        }

        egui::SidePanel::left("side_panel").show(ctx, |ui| {
            ui.heading("GameBoy Emulator");
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
                ui.label("Device");
                ui.selectable_value(device, Device::AutoDetect, "Auto detect");
                ui.selectable_value(device, Device::DMG, "DMG");
                ui.selectable_value(device, Device::CGB, "CGB");
            });
            ui.end_row();

            ui.horizontal(|ui| {
                ui.label("Emulation speed");
                for i in 1..5 {
                    ui.selectable_value(speed, i, format!("{}x", i));
                }
            });
            ui.end_row();

            ui.horizontal(|ui| {
                if ui.button("Next instruction").clicked() {
                    emulator.run_instruction();
                }

                if ui.button("Next frame").clicked() {
                    emulator.run_frame();
                }
            });

            ui.separator();

            ui.horizontal(|ui| {
                ui.add(
                    egui::TextEdit::singleline(run_until)
                        .desired_width(80.0)
                        .hint_text("Run until"),
                );
                if ui.button("Run until").clicked() {
                    let until: u32 = run_until.parse().unwrap();

                    // Restart & fast-forward if requested cycles are in the past
                    if emulator.cpu.total_cycles > until {
                        let cart = if let Some(binary) = rom_data {
                            Cartridge::from_bytes(binary)
                        } else {
                            Cartridge::empty()
                        };
                        *emulator = Emulator::new(false, cart, Box::new(DummyAudio {}), *device);
                    }

                    while emulator.cpu.total_cycles <= until {
                        emulator.run_instruction();
                    }
                }
            });

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
                ui.style_mut()
                    .text_styles
                    .get_mut(&TextStyle::Body)
                    .unwrap()
                    .family = FontFamily::Monospace;
            });
        });

        if *running {
            // Run frame
            for _ in 0..*speed {
                emulator.run_frame();
            }
        }

        // ------------------ GB DISPLAY ----------------------
        components.display.show(ctx, emulator);

        egui::CentralPanel::default().show(ctx, |ui| {
            egui::warn_if_debug_build(ui);
        });

        // ------------------ TILES ----------------------
        components.tiles.show(ctx, &mut true, emulator);

        // ------------------ MEMORY ----------------------
        components.memory_viewer.show(ctx, emulator, &mut true);

        // ------------------ MAPS ----------------------
        components.maps.show(ctx, &mut true, emulator);

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

    fn save(&mut self, _storage: &mut dyn Storage) {}

    fn auto_save_interval(&self) -> std::time::Duration {
        std::time::Duration::from_secs(30)
    }

    fn max_size_points(&self) -> egui::Vec2 {
        Vec2::new(2000.0, 2000.0)
    }
}
