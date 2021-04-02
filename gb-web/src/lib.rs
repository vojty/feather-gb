use wasm_bindgen::prelude::*;

use std::panic;

use gb::{
    cartridges::cartridge::Cartridge, emulator::Emulator, joypad::JoypadKey, ppu::ppu::Palettes,
};

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
pub enum JSKeys {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    A,
    B,
    Start,
    Select,
}

// TODO find out, how to re-export existing enum to wasm in this web project
fn translate_key(input: JSKeys) -> JoypadKey {
    match input {
        JSKeys::ArrowDown => JoypadKey::ArrowDown,
        JSKeys::ArrowUp => JoypadKey::ArrowUp,
        JSKeys::ArrowLeft => JoypadKey::ArrowLeft,
        JSKeys::ArrowRight => JoypadKey::ArrowRight,
        JSKeys::A => JoypadKey::A,
        JSKeys::B => JoypadKey::B,
        JSKeys::Start => JoypadKey::Start,
        JSKeys::Select => JoypadKey::Select,
    }
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

    pub fn on_key_down(&mut self, input_key: JSKeys) {
        self.e.on_key_down(translate_key(input_key));
    }

    pub fn on_key_up(&mut self, input_key: JSKeys) {
        self.e.on_key_up(translate_key(input_key));
    }
}

#[wasm_bindgen]
pub fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}
