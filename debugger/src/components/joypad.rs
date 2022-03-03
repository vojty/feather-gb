use eframe::egui::{self, Key};
use gb::{emulator::Emulator, joypad::JoypadKey};

fn get_joypad_key(key: &Key) -> Option<JoypadKey> {
    match key {
        Key::ArrowDown | Key::S => Some(JoypadKey::ArrowDown),
        Key::ArrowLeft | Key::A => Some(JoypadKey::ArrowLeft),
        Key::ArrowUp | Key::W => Some(JoypadKey::ArrowUp),
        Key::ArrowRight | Key::D => Some(JoypadKey::ArrowRight),
        Key::J | Key::X => Some(JoypadKey::A),
        Key::K | Key::C => Some(JoypadKey::B),
        Key::B => Some(JoypadKey::Start),
        Key::N => Some(JoypadKey::Select),
        _ => None,
    }
}

pub fn handle_inputs(e: &mut Emulator, ctx: &egui::Context) {
    let input = ctx.input();
    KEYS.iter()
        .filter_map(|key| match input.key_down(*key) {
            true => get_joypad_key(key),
            false => None,
        })
        .for_each(|joypad_key| e.on_key_down(joypad_key));
    KEYS.iter()
        .filter_map(|key| match input.key_released(*key) {
            true => get_joypad_key(key),
            false => None,
        })
        .for_each(|joypad_key| e.on_key_up(joypad_key));
}

pub const KEYS: [Key; 14] = [
    Key::ArrowDown,
    Key::ArrowLeft,
    Key::ArrowRight,
    Key::ArrowUp,
    Key::A,
    Key::W,
    Key::S,
    Key::D,
    // A
    Key::J,
    Key::X,
    // B
    Key::K,
    Key::C,
    // Start
    Key::B,
    // Select
    Key::N,
];
