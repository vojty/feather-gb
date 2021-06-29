use std::{
    fs::File,
    io::Read,
    time::{Duration, Instant},
};

use crate::audio::Audio;
use env_logger::Env;
use gb::{
    cartridges::cartridge::Cartridge,
    constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH},
    emulator::Emulator,
    joypad::JoypadKey,
};
use sdl2::{event::Event, keyboard::Keycode, pixels::Color, Sdl};

mod audio;

fn get_file_as_byte_vec(filename: &str) -> Vec<u8> {
    let mut f = File::open(&filename).expect("no file found");

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
    let audio_device = Box::new(Audio::new(&sdl_context));

    Emulator::new(false, Cartridge::from_bytes(bytes), audio_device)
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

    let mut carry = Duration::new(0, 0);

    let mut running = false;
    let mut run_one_frame = false;
    let mut restart = false;

    'running: loop {
        let time = Instant::now();

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

        if running || run_one_frame {
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
        }

        if restart {
            emulator = create_emulator(&sdl_context, &bytes);
            canvas.clear();
            canvas.set_draw_color(Color::WHITE);
            canvas.present();
        }

        restart = false;
        run_one_frame = false;

        let elapsed = time.elapsed() + carry;
        let sleep = Duration::new(0, 1_000_000_000 / 60);
        if elapsed < sleep {
            carry = Duration::new(0, 0);
            std::thread::sleep(sleep - elapsed);
        } else {
            carry = elapsed - sleep;
        }
    }
}
