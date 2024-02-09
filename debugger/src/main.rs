#![forbid(unsafe_code)]
// #![cfg_attr(not(debug_assertions), deny(warnings))] // Forbid warnings in release builds
#![warn(clippy::all, rust_2018_idioms)]
#![allow(
    clippy::let_and_return,
    clippy::new_without_default,
    clippy::trivial_regex
)]

use eframe::egui::ViewportBuilder;
use eframe::NativeOptions;
use env_logger::Env;

use debugger::app::Debugger;
use debugger::utils::{load_roms, BinarySource};

fn main() -> Result<(), eframe::Error> {
    let roms: Vec<Box<dyn BinarySource>> = load_roms();

    env_logger::Builder::from_env(Env::default().default_filter_or("debug"))
        .format_timestamp(None)
        .format_level(false)
        .format_module_path(false)
        .target(env_logger::Target::Stdout)
        .init();

    let native_options = NativeOptions {
        viewport: ViewportBuilder::default()
            .with_inner_size([1700.0, 1000.0])
            .with_min_inner_size([1700.0, 1000.0]),
        ..Default::default()
    };

    eframe::run_native(
        "GameBoy emulator Debugger",
        native_options,
        Box::new(|cc| Box::new(Debugger::new(cc, roms))),
    )
}
