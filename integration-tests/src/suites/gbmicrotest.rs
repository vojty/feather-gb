use gb::emulator::Device;
use gb::traits::MemoryAccess;
use glob::glob;

use crate::{
    report::{run_parallel, SuiteReport, TestRow},
    utils::create_emulator,
};

// Results are written to 0xFF80-0xFF82, 0xFF82 is 0x01 (pass) or 0xFF (fail)
const RESULT: u16 = 0xFF80;
const EXPECTED: u16 = 0xFF81;
const STATUS: u16 = 0xFF82;
const MAX_INSTRUCTIONS: u32 = 2_000_000;

type TestResult = (String, bool, String); // (pathname, valid, details)

// Some ROMs are testbenches/scratch files which never report a result, use only the ones whose
// source finishes with a result macro
fn reports_result(path: &str) -> bool {
    let source = path.replace("/bin/", "/tests/").replace(".gb", ".s");
    std::fs::read_to_string(source)
        .map(|s| {
            ["test_finish", "test_pass", "test_fail"]
                .iter()
                .any(|m| s.contains(m))
        })
        .unwrap_or(false)
}

fn get_tests() -> Vec<String> {
    let mut files: Vec<String> = glob("./roms/gbmicrotest/bin/*.gb")
        .expect("Failed to read glob pattern")
        .map(|entry| entry.unwrap().into_os_string().into_string().unwrap())
        .filter(|path| reports_result(path))
        .collect();
    files.sort();
    files
}

fn execute_test(path: String) -> TestResult {
    let mut e = create_emulator(&path, Device::DMG);
    // HRAM isn't cleared on boot, the test writes the status as its last step
    e.hw.write_byte(STATUS, 0x00);

    for _ in 0..MAX_INSTRUCTIONS {
        e.run_instruction();
        if matches!(e.hw.read_byte(STATUS), 0x01 | 0xFF) {
            break;
        }
    }

    let status = e.hw.read_byte(STATUS);
    let details = match status {
        0x01 | 0xFF => format!(
            "got {:02x}, expected {:02x}",
            e.hw.read_byte(RESULT),
            e.hw.read_byte(EXPECTED)
        ),
        _ => "timeout".to_string(),
    };
    (path, status == 0x01, details)
}

pub fn run_filtered(filter: &str) -> Vec<TestResult> {
    get_tests()
        .into_iter()
        .filter(|f| f.contains(filter))
        .map(execute_test)
        .collect()
}

pub async fn run_tests() -> SuiteReport {
    let results = run_parallel(get_tests(), String::clone, |path| {
        let (path, valid, details) = execute_test(path);
        TestRow::new(path, valid, vec![details])
    })
    .await;

    SuiteReport::new(
        "gbmicrotest",
        &["https://github.com/aappleby/gbmicrotest"],
        "Hardware verified DMG tests.",
        &["Details"],
        results,
    )
}
