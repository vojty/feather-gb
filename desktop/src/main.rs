use std::{
    fs::File,
    io::Read,
    time::{Duration, Instant},
};

use crate::audio::Audio;
use env_logger::Env;
use gb::{
    cartridges::cartridge::Cartridge,
    constants::{CPU_CLOCK_SPEED, DISPLAY_HEIGHT, DISPLAY_WIDTH},
    emulator::Emulator,
    joypad::JoypadKey,
};
use sdl2::{event::Event, keyboard::Keycode, pixels::Color, Sdl};

mod audio;

// Upper bound of emulated time per loop iteration, so the emulator won't fast-forward after a stall
const MAX_CATCH_UP: Duration = Duration::from_millis(100);
// Polling interval for events while paused
const IDLE_SLEEP: Duration = Duration::from_millis(1);

fn get_file_as_byte_vec(filename: &str) -> Vec<u8> {
    let mut f = File::open(filename).expect("no file found");

    let mut data = vec![];
    f.read_to_end(&mut data).unwrap();

    data
}

fn map_joypad_key(key: Keycode) -> Option<JoypadKey> {
    match key {
        Keycode::Down | Keycode::S => Some(JoypadKey::ArrowDown),
        Keycode::Left | Keycode::A => Some(JoypadKey::ArrowLeft),
        Keycode::Up | Keycode::W => Some(JoypadKey::ArrowUp),
        Keycode::Right | Keycode::D => Some(JoypadKey::ArrowRight),
        Keycode::J | Keycode::X => Some(JoypadKey::A),
        Keycode::K | Keycode::C => Some(JoypadKey::B),
        Keycode::B => Some(JoypadKey::Start),
        Keycode::N => Some(JoypadKey::Select),
        _ => None,
    }
}

fn create_emulator(sdl_context: &Sdl, bytes: &[u8]) -> Emulator {
    let audio_device = Box::new(Audio::new(sdl_context));
    let cartridge = Cartridge::from_bytes(bytes);
    let device = match cartridge.supports_cgb() {
        true => gb::emulator::Device::CGB,
        false => gb::emulator::Device::DMG,
    };
    Emulator::new(false, cartridge, audio_device, device)
}

fn main() {
    env_logger::Builder::from_env(Env::default().default_filter_or("debug"))
        .format_timestamp(None)
        .format_level(false)
        .format_module_path(false)
        .target(env_logger::Target::Stdout)
        .init();

    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();

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
    let mut event_pump = sdl_context.event_pump().unwrap();

    // let bytes = get_file_as_byte_vec("roms/demos/gejmboj.gb");
    let bytes = get_file_as_byte_vec("roms/demos/oh.gb");
    // let bytes = get_file_as_byte_vec("roms/games/mario.gb");
    // let bytes = get_file_as_byte_vec("roms/games/pokemon-silver.gbc");

    let mut emulator = create_emulator(&sdl_context, &bytes);

    // Emulated cycles which should run to catch up with real time, negative when ahead
    let mut cycle_budget: f64 = 0.0;
    let mut last_time = Instant::now();

    let mut running = false;
    let mut run_one_frame = false;
    let mut restart = false;

    'running: loop {
        let time = Instant::now();
        // Includes the oversleep of the previous iteration, so the pace doesn't drift
        let elapsed = time - last_time;
        last_time = time;

        // Handle events
        for event in event_pump.poll_iter() {
            match event {
                Event::Quit { .. } => {
                    break 'running;
                }
                Event::KeyUp { keycode, .. } => {
                    if let Some(key) = keycode.and_then(map_joypad_key) {
                        emulator.on_key_up(key)
                    }
                }
                Event::KeyDown { keycode, .. } => {
                    if let Some(Keycode::P) = keycode {
                        running = !running;
                    }
                    if let Some(Keycode::O) = keycode {
                        run_one_frame = true;
                    }
                    if let Some(Keycode::R) = keycode {
                        restart = true;
                    }

                    if let Some(key) = keycode.and_then(map_joypad_key) {
                        emulator.on_key_down(key)
                    }
                }
                _ => {}
            }
        }

        let mut frame_ran = false;
        if running {
            let max_budget = MAX_CATCH_UP.as_secs_f64() * CPU_CLOCK_SPEED as f64;
            cycle_budget += elapsed.as_secs_f64() * CPU_CLOCK_SPEED as f64;
            cycle_budget = cycle_budget.min(max_budget);
            while cycle_budget > 0.0 {
                cycle_budget -= emulator.run_frame() as f64;
                frame_ran = true;
            }
        } else {
            cycle_budget = 0.0;
            if run_one_frame {
                emulator.run_frame();
                frame_ran = true;
            }
        }

        if frame_ran {
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
        }

        if restart {
            emulator = create_emulator(&sdl_context, &bytes);
            canvas.clear();
            canvas.set_draw_color(Color::WHITE);
            canvas.present();
        }

        restart = false;
        run_one_frame = false;

        // Sleep until the emulator is behind real time again
        let sleep = if running && cycle_budget < 0.0 {
            Duration::from_secs_f64(-cycle_budget / CPU_CLOCK_SPEED as f64)
        } else {
            IDLE_SLEEP
        };
        std::thread::sleep(sleep);
    }
}
