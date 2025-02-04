use futures::{future::join_all, TryFutureExt};

use gb::emulator::{Device, Emulator};
use glob::glob;
use regex::Regex;

use crate::utils::{get_result_mark, path_to_basename};
use crate::{markdown, utils::create_emulator};

/*
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

fn should_collect(basename: String) -> bool {
    // Test with no group -> use
    if !basename.contains('-') {
        return true;
    }

    let re = Regex::new("^(.*)-(?P<group>.*).gb$").unwrap();
    let captures = re.captures(&basename).unwrap();
    let group = captures["group"].to_string();

    // test only dmg + dmgABC
    group.contains('G') || group.contains("dmgABC")
}

fn get_tests() -> Vec<String> {
    let mut files = vec![];
    for entry in glob("./roms/mooneye-test-suite/**/*.gb").expect("Failed to read glob pattern") {
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

fn execute_test(path: String) -> TestResult {
    let mut e = create_emulator(&path, Device::AutoDetect);

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

fn generate_test_report(results: Vec<Result<TestResult, String>>) -> String {
    let data = results
        .into_iter()
        .map(|result| match result {
            Ok((path, valid)) => vec![path, get_result_mark(valid)],
            Err(test_name) => vec![test_name, format!("{} (crashes)", get_result_mark(false))],
        })
        .collect::<Vec<Vec<String>>>();

    let headings = ["Test", "Result"];
    let result = markdown::table(&headings, &data);

    markdown::test_report(
        "Mooneye Test Suite",
        "https://github.com/Gekkio/mooneye-test-suite\n\nOnly DMG compatible tests used.",
        &result,
    )
}

pub async fn run_tests() -> String {
    let files = get_tests();

    let mut handles = vec![];
    for file in files {
        let name = file.clone();
        let handle = tokio::spawn(async move { execute_test(file) }).map_err(|_| name);
        handles.push(handle);
    }

    let results = join_all(handles).await;
    generate_test_report(results)
}
