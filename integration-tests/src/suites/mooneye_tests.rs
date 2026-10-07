use gb::emulator::{Device, Emulator};
use glob::glob;
use regex::Regex;

use crate::{
    report::{run_parallel, SuiteReport, TestRow},
    utils::{create_emulator, path_to_basename},
};

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

fn execute_test_verbose(path: String) -> (String, bool, String) {
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

    let dump = format!(
        "A={:02X} B={:02X} C={:02X} D={:02X} E={:02X} H={:02X} L={:02X}",
        e.cpu.a, e.cpu.b, e.cpu.c, e.cpu.d, e.cpu.e, e.cpu.h, e.cpu.l
    );
    (path, is_valid(&e), dump)
}

/// Runs only tests whose path contains `filter`, returns (path, valid, register dump)
pub fn run_filtered(filter: &str) -> Vec<(String, bool, String)> {
    let files: Vec<String> = get_tests()
        .into_iter()
        .filter(|f| f.contains(filter))
        .collect();
    let handles: Vec<_> = files
        .into_iter()
        .map(|file| std::thread::spawn(move || execute_test_verbose(file)))
        .collect();
    handles.into_iter().map(|h| h.join().unwrap()).collect()
}

pub async fn run_tests() -> SuiteReport {
    let results = run_parallel(get_tests(), String::clone, |path| {
        let (path, valid, _) = execute_test_verbose(path);
        TestRow::new(path, valid, vec![])
    })
    .await;

    SuiteReport::new(
        "Mooneye Test Suite",
        &["https://github.com/Gekkio/mooneye-test-suite"],
        "Only DMG compatible tests.",
        &[],
        results,
    )
}
