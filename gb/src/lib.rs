#![warn(clippy::all, rust_2018_idioms)]
#![allow(
    clippy::let_and_return,
    clippy::clippy::new_without_default,
    clippy::clippy::len_zero,
    clippy::clippy::module_inception,
    clippy::clippy::single_match,
    clippy::clippy::many_single_char_names,
    non_fmt_panic
)]

mod bios;
pub mod cartridges;
pub mod constants;
pub mod cpu;
mod dma;
pub mod emulator;
pub mod interrupts;
pub mod joypad;
pub mod ppu;
mod timer;
pub mod traits;
mod utils;
mod wram;
