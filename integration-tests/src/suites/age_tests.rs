use gb::emulator::{Device, Emulator};
use glob::glob;

use crate::{
    markdown,
    report::{run_parallel, SuiteReport, TestRow},
    utils::{create_emulator, path_to_basename, save_screen, OUTPUT_DIR},
};

fn should_collect(basename: String) -> bool {
    basename.contains("dmgC")
}

fn get_tests() -> Vec<String> {
    let mut files = vec![];
    for entry in glob("./roms/age-test-roms/**/*.gb").expect("Failed to read glob pattern") {
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

type TestResult = (String, bool, String); // (pathname, valid, screenshot)

fn execute_test(path: String) -> TestResult {
    let mut e = create_emulator(&path, Device::DMG); // TODO: use different devices

    let max_frames_to_run = 230;

    for _ in 0..max_frames_to_run {
        e.run_frame();

        // Dummy check for LD B,B breakpoint
        if !e.hw.events.is_empty() {
            break;
        }
    }

    let basename = path_to_basename(&path);
    let result_image = format!("{OUTPUT_DIR}/age-tests/{basename}/result.png");
    save_screen(&e, &result_image);

    (path, is_valid(&e), markdown::image(result_image))
}

pub async fn run_tests() -> SuiteReport {
    let results = run_parallel(get_tests(), String::clone, |path| {
        let (path, valid, screenshot) = execute_test(path);
        TestRow::new(path, valid, vec![screenshot])
    })
    .await;

    SuiteReport::new(
        "AGE test suite",
        &["https://github.com/c-sp/age-test-roms"],
        "Only DMG tests for now.",
        &["Screenshot"],
        results,
    )
}

/// Runs matching tests and, for the generic `write.inc`/`read.inc` style tests,
/// dumps the TIMING_RESULTS table (from the .sym file) vs EXPECTED_TIMING_RESULTS.
pub fn run_filtered(filter: &str) -> Vec<TestResult> {
    use gb::traits::MemoryAccess;

    get_tests()
        .into_iter()
        .filter(|f| f.contains(filter))
        .map(|path| {
            let (path, valid, _) = execute_test(path);
            let mut details = String::new();
            let sym = std::fs::read_to_string(path.replace(".gb", ".sym")).unwrap_or_default();
            let addr = |name: &str| {
                sym.lines()
                    .find(|l| l.ends_with(&format!(" {name}")))
                    .and_then(|l| u16::from_str_radix(&l[3..7], 16).ok())
            };
            if let (Some(res), Some(exp)) =
                (addr("TIMING_RESULTS"), addr("EXPECTED_TIMING_RESULTS"))
            {
                let mut e = create_emulator(&path, Device::DMG);
                for _ in 0..230 {
                    e.run_frame();
                    if !e.hw.events.is_empty() {
                        break;
                    }
                }
                // 8 SCX values * 5 lines * 12 bytes (DMG)
                for row in 0..40u16 {
                    let r: Vec<u8> = (0..12)
                        .map(|i| e.hw.read_byte(res + row * 12 + i))
                        .collect();
                    let x: Vec<u8> = (0..12)
                        .map(|i| e.hw.read_byte(exp + row * 12 + i))
                        .collect();
                    if r != x {
                        details.push_str(&format!(
                            "\n  SCX {} delay {}: got {:02x?}\n               want {:02x?}",
                            row / 5,
                            row % 5,
                            r,
                            x
                        ));
                    }
                }
            }
            (path, valid, details)
        })
        .collect()
}
