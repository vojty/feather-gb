use std::fs;

use futures::future::join_all;
use gb::{cartridges::cartridge::Cartridge, emulator::Emulator};
use glob::glob;
use regex::Regex;
use tokio::task::JoinError;
use utils::{get_file_as_byte_vec, get_result_mark};

mod markdown;
mod utils;

/**
 * Test groups:
 *
 * dmg = Game Boy
 * mgb = Game Boy Pocket
 * sgb = Super Game Boy
 * sgb2 = Super Game Boy 2
 * cgb = Game Boy Color
 * agb = Game Boy Advance
 * ags = Game Boy Advance SP
 *
 * G = dmg+mgb
 * S = sgb+sgb2
 * C = cgb+agb+ags
 * A = agb+ags
 */

fn path_to_basename(path: &str) -> String {
    match path.split('/').into_iter().last() {
        Some(last) => last.to_string(),
        None => panic!("Can't get basename from path {}", path),
    }
}

fn should_collect(basename: String) -> bool {
    // Test with no group -> use
    if !basename.contains('-') {
        return true;
    }

    let re = Regex::new("^(.*)-(?P<group>.*).gb$").unwrap();
    let captures = re.captures(&basename).unwrap();
    let group = captures["group"].to_string();

    // TODO test dmgABC as well?
    // test only dmg0 + G groups
    group.contains('G') || group.contains("dmg0")
}

fn get_tests() -> Vec<String> {
    let mut files = vec![];
    for entry in glob("./roms/mooneye-gb/**/*.gb").expect("Failed to read glob pattern") {
        match entry {
            Ok(path) => {
                let path = path.into_os_string().into_string().unwrap();
                let basename = path_to_basename(&path);
                if should_collect(basename) {
                    files.push(path);
                }
            }
            Err(e) => panic!("Glob file error, {:?}", e),
        }
    }
    files
}

fn is_valid(e: &Emulator) -> bool {
    e.cpu.b == 0x03
        && e.cpu.c == 0x05
        && e.cpu.d == 0x08
        && e.cpu.e == 0x0d
        && e.cpu.h == 0x15
        && e.cpu.l == 0x22
}

type TestResult = (String, bool); // (pathname, valid)

async fn execute_test(path: String) -> TestResult {
    let bytes = get_file_as_byte_vec(&path);
    let cartridge = Cartridge::from_bytes(bytes);
    let mut e = Emulator::new(false, cartridge);

    // mbc2/bits_ramg is the longest one
    let max_frames_to_run = 60 * 8;

    for _ in 0..max_frames_to_run {
        e.run_frame();

        // Dummy check for LD B,B breakpoint
        if !e.hw.events.is_empty() {
            break;
        }
    }

    (path, is_valid(&e))
}

fn write_results(results: Vec<Result<TestResult, JoinError>>) {
    let data = results
        .iter()
        .filter_map(|result| match result {
            Ok((path, valid)) => Some(vec![path.clone(), get_result_mark(*valid)]),
            Err(_) => None,
        })
        .collect::<Vec<Vec<String>>>();

    let headings = ["Test", "Result"];
    let result = markdown::table(&headings, &data);

    let content = markdown::test_report(
        "Mooneye's test",
        "https://github.com/Gekkio/mooneye-gb",
        &result,
    );

    fs::write("docs/results/results-mooneyes.md", content).unwrap();
}

#[tokio::main]
pub async fn main() {
    let files = get_tests();

    let mut handles = vec![];
    for file in files {
        let handle = tokio::spawn(async move { execute_test(file).await });
        handles.push(handle);
    }

    let results = join_all(handles).await;
    write_results(results);
}
