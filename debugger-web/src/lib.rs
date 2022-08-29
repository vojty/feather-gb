#![forbid(unsafe_code)]
#![warn(clippy::all, rust_2018_idioms)]
#![allow(clippy::unused_unit)]

use debugger::app::Debugger;
use eframe::wasm_bindgen::{self, prelude::*};
use eframe::web::AppRunnerRef;
use roms::collect_files;

mod roms;

#[wasm_bindgen]
pub struct WebHandle {
    handle: AppRunnerRef,
}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen]
    #[cfg(target_arch = "wasm32")]
    pub fn stop_web(&self) -> Result<(), wasm_bindgen::JsValue> {
        let mut app = self.handle.lock();
        let res = app.destroy();

        res
    }
}

/// This is the entry-point for all the web-assembly.
/// This is called once from the HTML.
/// It loads the app, installs some callbacks, then returns.
#[wasm_bindgen]
pub fn start(canvas_id: &str, data: JsValue) -> Result<WebHandle, wasm_bindgen::JsValue> {
    // Make sure panics are logged using `console.error`
    console_error_panic_hook::set_once();

    // Redirect tracing to console.log and friends:
    tracing_wasm::set_as_global_default();

    let roms = collect_files(data);
    let web_options = eframe::WebOptions::default();

    let handle = eframe::start_web(
        canvas_id,
        web_options,
        Box::new(|cc| Box::new(Debugger::new(cc, roms))),
    )
    .map(|handle| WebHandle { handle });

    handle
}
