use std::{
    fs::{self, create_dir_all, File},
    io::Read,
    path::{Path, PathBuf},
};

use gb::{
    audio::AudioDevice,
    cartridges::cartridge::Cartridge,
    constants::{DISPLAY_HEIGHT, DISPLAY_WIDTH},
    emulator::{Device, Emulator},
};
use image::ImageBuffer;
use pixelmatch::pixelmatch;

pub const OUTPUT_DIR: &str = "docs/results";

fn get_file_as_byte_vec(filename: &str) -> Vec<u8> {
    let mut f = File::open(filename).expect("no file found");

    let mut data = vec![];
    f.read_to_end(&mut data).unwrap();

    data
}

pub fn path_to_basename(path: &str) -> String {
    match path.split('/').last() {
        Some(last) => last.to_string(),
        None => panic!("Can't get basename from path {}", path),
    }
}

pub fn get_result_mark(valid: bool) -> String {
    if valid {
        String::from('✅')
    } else {
        String::from('❌')
    }
}

pub fn create_path(paths: &[&str]) -> String {
    paths
        .iter()
        .collect::<PathBuf>()
        .to_str()
        .unwrap()
        .to_string()
}

struct DummyAudio;

impl AudioDevice for DummyAudio {
    fn queue(&mut self, _buffer: &[f32]) {
        // noop - no sound for tests
    }
}

pub fn create_emulator(path: &str, device: Device) -> Emulator {
    let binary = get_file_as_byte_vec(path);
    let cartridge = Cartridge::from_bytes(&binary);
    Emulator::new(false, cartridge, Box::new(DummyAudio {}), device)
}

pub fn save_screen(e: &Emulator, path: impl Into<String>) {
    let screen = e.get_screen_buffer();
    let image = ImageBuffer::from_fn(DISPLAY_WIDTH as u32, DISPLAY_HEIGHT as u32, |x, y| {
        let pixel = screen.get_pixel(x as usize, y as usize);
        image::Rgb([pixel.r, pixel.g, pixel.b])
    });

    let path: String = path.into();

    let directory = Path::new(&path).parent().unwrap();
    create_dir_all(directory).unwrap();

    image.save(&path).unwrap();
}

pub fn copy_file(from: &str, to: &str) {
    let to_directory = Path::new(&to).parent().unwrap();

    create_dir_all(to_directory).unwrap_or_else(|_| {
        panic!(
            "Can't create target directory {}",
            to_directory.to_str().unwrap()
        )
    });
    fs::copy(from, to)
        .unwrap_or_else(|error| panic!("Can't copy [{}] -> [{}]. Error {}", from, to, error));
}

pub fn save_diff_image(reference_image: &str, result_image: &str, diff_image: &str) -> usize {
    let reference =
        File::open(reference_image).unwrap_or_else(|_| panic!("Can't open {}", reference_image));
    let result = File::open(result_image).unwrap();

    let mut diff_image_data = Vec::new();
    let output = Some(&mut diff_image_data);

    let diff = pixelmatch(
        reference,
        result,
        output,
        Some(DISPLAY_WIDTH as u32),
        Some(DISPLAY_HEIGHT as u32),
        None,
    )
    .unwrap();

    std::fs::write(diff_image, diff_image_data).unwrap();

    diff
}
