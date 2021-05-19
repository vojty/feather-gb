use wasm_bindgen::prelude::*;

use std::panic;

use gb::{
    cartridges::cartridge::Cartridge, emulator::Emulator, joypad::JoypadKey,
    ppu::palettes::DmgPalettes,
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
pub enum JsKeys {
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
fn translate_key(input: JsKeys) -> JoypadKey {
    match input {
        JsKeys::ArrowDown => JoypadKey::ArrowDown,
        JsKeys::ArrowUp => JoypadKey::ArrowUp,
        JsKeys::ArrowLeft => JoypadKey::ArrowLeft,
        JsKeys::ArrowRight => JoypadKey::ArrowRight,
        JsKeys::A => JoypadKey::A,
        JsKeys::B => JoypadKey::B,
        JsKeys::Start => JoypadKey::Start,
        JsKeys::Select => JoypadKey::Select,
    }
}

#[wasm_bindgen]
impl WebEmulator {
    #[wasm_bindgen(constructor)]
    pub fn new(web_cartridge: WebCartridge) -> WebEmulator {
        let mut e = Emulator::new(false, web_cartridge.cartridge);
        e.set_system_palette(&DmgPalettes::GreenDmg);
        WebEmulator { e }
    }

    pub fn run_frame(&mut self) {
        self.e.run_frame()
    }

    pub fn get_canvas_data_pointer(&self) -> *const u8 {
        self.e.get_screen_buffer().get_raw_data()
    }

    pub fn on_key_down(&mut self, input_key: JsKeys) {
        self.e.on_key_down(translate_key(input_key));
    }

    pub fn on_key_up(&mut self, input_key: JsKeys) {
        self.e.on_key_up(translate_key(input_key));
    }
}

#[wasm_bindgen]
pub fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}
