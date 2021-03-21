use wasm_bindgen::prelude::*;

use std::panic;

use gb::{cartridges::cartridge::Cartridge, emulator::Emulator, ppu::ppu::Palettes};

#[wasm_bindgen]
pub struct WebCartridge {
    cartridge: Cartridge,
}

#[wasm_bindgen]
impl WebCartridge {
    #[wasm_bindgen(constructor)]
    pub fn new(bytes: Vec<u8>) -> WebCartridge {
        WebCartridge {
            cartridge: Cartridge::from_bytes(bytes),
        }
    }
}

#[wasm_bindgen]
pub struct WebEmulator {
    e: Emulator,
}

#[wasm_bindgen]
impl WebEmulator {
    #[wasm_bindgen(constructor)]
    pub fn new(web_cartridge: WebCartridge) -> WebEmulator {
        let mut e = Emulator::new(false, web_cartridge.cartridge);
        e.set_system_palette(Palettes::GreenDmg);
        WebEmulator { e }
    }

    pub fn run_frame(&mut self) {
        self.e.run_frame()
    }

    pub fn get_canvas_data_pointer(&self) -> *const u8 {
        self.e.get_screen_buffer().get_raw_data()
    }
}

#[wasm_bindgen]
pub fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}
