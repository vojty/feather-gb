#![forbid(unsafe_code)]
// #![cfg_attr(not(debug_assertions), deny(warnings))] // Forbid warnings in release builds
#![warn(clippy::all, rust_2018_idioms)]
#![allow(
    clippy::let_and_return,
    clippy::clippy::new_without_default,
    clippy::clippy::trivial_regex
)]

use env_logger::Env;

use debugger::app::Debugger;
use debugger::utils::{load_roms, BinarySource};

fn main() {
    let roms: Vec<Box<dyn BinarySource>> = load_roms();
    let app = Debugger::new(roms);

    env_logger::Builder::from_env(Env::default().default_filter_or("debug"))
        .format_timestamp(None)
        .format_level(false)
        .format_module_path(false)
        .target(env_logger::Target::Stdout)
        .init();

    eframe::run_native(Box::new(app));
}
