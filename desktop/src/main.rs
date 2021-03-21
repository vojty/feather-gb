use std::{fs::File, io::Read, thread::sleep, time::Duration};

use env_logger::Env;
use gb::{
    cartridges::cartridge::Cartridge,
    constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH},
    emulator::Emulator,
};
use sdl2::{event::Event, keyboard::Keycode, pixels::Color};

extern crate log;

struct Cleanup;

impl Drop for Cleanup {
    fn drop(&mut self) {
        eprintln!("Doing some final cleanup");
    }
}

fn get_file_as_byte_vec(filename: &str) -> Vec<u8> {
    let mut f = File::open(&filename).expect("no file found");

    let mut data = vec![];
    f.read_to_end(&mut data).unwrap();

    data
}

fn main() -> Result<(), String> {
    let _cleanup = Cleanup;

    env_logger::Builder::from_env(Env::default().default_filter_or("debug"))
        .format_timestamp(None)
        .format_level(false)
        .format_module_path(false)
        .target(env_logger::Target::Stdout)
        .init();

    let sdl_context = sdl2::init()?;
    let video_subsystem = sdl_context.video()?;

    let window = video_subsystem
        .window(
            "GameBoy Emulator",
            DISPLAY_WIDTH as u32,
            DISPLAY_HEIGHT as u32,
        )
        .position_centered()
        .build()
        .unwrap();

    let mut canvas = window.into_canvas().software().build().unwrap();

    let mut event_pump = sdl_context.event_pump()?;

    let bytes = get_file_as_byte_vec("roms/demos/dmg-acid2.gb");

    let mut emulator = Emulator::new(false, Cartridge::from_bytes(bytes));

    'running: loop {
        // Handle events
        for event in event_pump.poll_iter() {
            match event {
                Event::Quit { .. }
                | Event::KeyDown {
                    keycode: Some(Keycode::Escape),
                    ..
                } => {
                    break 'running;
                }
                _ => {}
            }
        }

        emulator.run_frame();
        let buffer = emulator.get_screen_buffer();

        canvas.clear();
        canvas.set_draw_color(Color::WHITE);
        for y in 0..DISPLAY_HEIGHT {
            for x in 0..DISPLAY_WIDTH {
                let pixel = buffer.get_pixel(x, y);

                let color = Color::RGB(pixel.r, pixel.g, pixel.b);
                canvas.set_draw_color(color);

                canvas.draw_point((x as i32, y as i32)).unwrap();
            }
        }

        canvas.present();

        // Time management
        sleep(Duration::new(0, 1_000_000_000u32 / 60));
    }

    Ok(())
}
