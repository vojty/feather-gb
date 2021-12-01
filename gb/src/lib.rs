#![warn(clippy::all, rust_2018_idioms)]
#![allow(
    clippy::let_and_return,
    clippy::new_without_default,
    clippy::len_zero,
    clippy::module_inception,
    clippy::collapsible_match,
    clippy::single_match,
    clippy::many_single_char_names,
    non_fmt_panics
)]

mod apu;
pub mod audio;
mod bios;
pub mod cartridges;
pub mod constants;
pub mod cpu;
mod dma;
pub mod emulator;
pub mod events;
mod hdma;
pub mod interrupts;
pub mod joypad;
pub mod ppu;
mod serial;
mod timer;
pub mod traits;
mod utils;
mod wram;
