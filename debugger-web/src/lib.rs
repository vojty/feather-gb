#![forbid(unsafe_code)]
#![warn(clippy::all, rust_2018_idioms)]
#![allow(clippy::unused_unit)]

use debugger::app::Debugger;
use eframe::WebRunner;
use roms::collect_files;
use wasm_bindgen::prelude::*;

mod roms;

#[wasm_bindgen]
pub struct WebHandle {
    runner: WebRunner,
}

#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen]
    pub fn stop_web(&self) {
        self.runner.destroy();
    }
}

/// This is the entry-point for all the web-assembly.
/// This is called once from the HTML.
/// It loads the app, installs some callbacks, then returns.
#[wasm_bindgen]
#[cfg(target_arch = "wasm32")]
pub async fn start(canvas_id: &str, data: JsValue) -> Result<WebHandle, wasm_bindgen::JsValue> {
    // Redirect tracing to console.log and friends:
    eframe::WebLogger::init(log::LevelFilter::Debug).ok();

    let roms = collect_files(data);
    let web_options = eframe::WebOptions::default();

    let runner = eframe::WebRunner::new();

    runner
        .start(
            canvas_id,
            web_options,
            Box::new(|cc| Box::new(Debugger::new(cc, roms))),
        )
        .await?;

    Ok(WebHandle { runner })
}
