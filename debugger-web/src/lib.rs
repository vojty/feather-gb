#![forbid(unsafe_code)]
#![warn(clippy::all, rust_2018_idioms)]

use debugger::app::Debugger;
use roms::collect_files;
use std::panic;
use wasm_bindgen::prelude::*;

mod roms;

#[wasm_bindgen]
pub fn start(canvas_id: &str, data: JsValue) -> Result<(), wasm_bindgen::JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    wasm_logger::init(wasm_logger::Config::default());

    let roms = collect_files(data);
    let app = Debugger::new(roms);

    egui_web::start(canvas_id, Box::new(app)).unwrap();

    Ok(())
}
