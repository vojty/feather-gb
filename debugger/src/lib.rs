#![forbid(unsafe_code)]
// #![cfg_attr(not(debug_assertions), deny(warnings))] // Forbid warnings in release builds
#![warn(clippy::all, rust_2018_idioms)]
#![allow(
    clippy::let_and_return,
    clippy::clippy::new_without_default,
    clippy::clippy::trivial_regex
)]

pub mod app;
mod canvas;
mod components;
mod opcodes;
pub mod ui_extensions;
pub mod utils;
