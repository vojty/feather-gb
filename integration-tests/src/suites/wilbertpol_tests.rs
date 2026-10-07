use gb::emulator::{Device, Emulator};
use gb::traits::MemoryAccess;
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

    // TODO test dmgABC as well?
    // test only dmg0 + G groups
    group.contains('G') || group.contains("dmg0")
}

fn get_tests() -> Vec<String> {
    let mut files = vec![];
    for entry in glob("./roms/wilbertpol-test-suite/**/*.gb").expect("Failed to read glob pattern")
    {
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

    let max_frames_to_run = 60;

    for _ in 0..max_frames_to_run {
        e.run_frame();

        // Dummy check for LD B,B breakpoint
        if !e.hw.events.is_empty() {
            break;
        }
    }

    // `setup_assertions` saves registers to HRAM (0xff80, AF/BC/DE/HL pushed little endian),
    // expected values are at 0xff89 (same layout), 0xc000 is a test case id in some tests
    let names = ["F", "A", "C", "B", "E", "D", "L", "H"];
    let dump = names
        .iter()
        .enumerate()
        .filter(|(_, name)| **name != "F")
        .map(|(i, name)| {
            let got = e.hw.read_byte(0xff80 + i as u16);
            let expected = e.hw.read_byte(0xff89 + i as u16);
            format!("{}={:02X}/{:02X}", name, got, expected)
        })
        .collect::<Vec<String>>()
        .join(" ");
    let dump = format!(
        "got/expected {} | c000={:02X}",
        dump,
        e.hw.read_byte(0xc000)
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
        "Wilbertpol's tests",
        &["https://github.com/vojty/wilbertpol-test-suite"],
        "Only DMG compatible tests.",
        &[],
        results,
    )
}
