use std::path::Path;

use gb::emulator::Device;
use glob::glob;

use crate::{
    tests::{execute_tests, VisualTestCase, VisualTestCaseBuilder},
    utils::path_to_basename,
};

const TESTS_PATH: &str = "roms/mealybug-tearoom-tests";

fn get_reference_image_path(test_name: &str) -> String {
    format!("{}/expected/DMG-blob/{}.png", TESTS_PATH, test_name)
}

fn get_files() -> Vec<(String, String)> {
    glob(&format!("{}/build/ppu/*.gb", TESTS_PATH))
        .expect("Failed to read glob pattern")
        .filter_map(|entry| match entry {
            Ok(path) => {
                let path = path.into_os_string().into_string().unwrap();
                let name = path_to_basename(&path).replace(".gb", "");
                Some((name, path))
            }
            Err(e) => panic!("Glob file error, {:?}", e),
        })
        .filter(|(name, _)| {
            // get only tests with existing reference image
            let reference_image = get_reference_image_path(name);
            Path::new(&reference_image).exists()
        })
        .collect::<Vec<(String, String)>>()
}

fn get_tests() -> Vec<VisualTestCase> {
    get_files()
        .into_iter()
        .map(|(name, rom_path)| {
            let reference_original = get_reference_image_path(&name);
            VisualTestCaseBuilder::new(name, rom_path, reference_original, Device::DMG).build()
        })
        .collect()
}

pub async fn run_tests() -> String {
    let tests = get_tests();

    execute_tests(
        "Mealybug Tearoom Tests",
        "https://github.com/mattcurrie/mealybug-tearoom-tests",
        tests,
    )
    .await
}
