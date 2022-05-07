#![forbid(unsafe_code)]
#![warn(clippy::all, rust_2018_idioms)]
#![allow(clippy::unused_unit)]

use debugger::app::Debugger;
use eframe::wasm_bindgen::{self, prelude::*};
use roms::collect_files;

mod roms;

#[wasm_bindgen]
pub fn start(canvas_id: &str, data: JsValue) -> Result<(), eframe::wasm_bindgen::JsValue> {
    console_error_panic_hook::set_once();
    tracing_wasm::set_as_global_default();

    let roms = collect_files(data);

    eframe::start_web(canvas_id, Box::new(|cc| Box::new(Debugger::new(cc, roms))))
}
