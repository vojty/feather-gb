use eframe::egui::{self, Key};
use gb::{emulator::Emulator, joypad};
enum GBKey {
    Arrow(joypad::ArrowKey),
    Button(joypad::ButtonKey),
}

// Sadly I can't use:
// fn get_joypad_key(key: &Key) -> Option<impl joypad::Key>
fn get_joypad_key(key: &Key) -> Option<GBKey> {
    match key {
        Key::ArrowDown | Key::S => Some(GBKey::Arrow(joypad::ArrowKey::DOWN)),
        Key::ArrowLeft | Key::A => Some(GBKey::Arrow(joypad::ArrowKey::LEFT)),
        Key::ArrowUp | Key::W => Some(GBKey::Arrow(joypad::ArrowKey::UP)),
        Key::ArrowRight | Key::D => Some(GBKey::Arrow(joypad::ArrowKey::RIGHT)),
        Key::J | Key::X => Some(GBKey::Button(joypad::ButtonKey::A)),
        Key::K | Key::C => Some(GBKey::Button(joypad::ButtonKey::B)),
        Key::B => Some(GBKey::Button(joypad::ButtonKey::START)),
        Key::N => Some(GBKey::Button(joypad::ButtonKey::SELECT)),
        _ => None,
    }
}

pub fn handle_inputs(e: &mut Emulator, ctx: &egui::CtxRef) {
    let input = ctx.input();
    KEYS.iter()
        .filter_map(|key| match input.key_down(*key) {
            true => get_joypad_key(key),
            false => None,
        })
        .for_each(|joypad_key| match joypad_key {
            GBKey::Button(k) => e.on_key_down(k),
            GBKey::Arrow(k) => e.on_key_down(k),
        });
    KEYS.iter()
        .filter_map(|key| match input.key_released(*key) {
            true => get_joypad_key(key),
            false => None,
        })
        .for_each(|joypad_key| match joypad_key {
            GBKey::Button(k) => e.on_key_up(k),
            GBKey::Arrow(k) => e.on_key_up(k),
        });
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
