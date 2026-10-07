use gb::emulator::Device;
use glob::glob;

use crate::{
    report::{run_parallel, SuiteReport, TestRow},
    utils::create_emulator,
};

fn should_collect(path: &str) -> bool {
    // no CGB sound
    if path.contains("/cgb_sound/") {
        return false;
    }

    // tested in different suite (sound tests don't have any output)
    if path.contains("/dmg_sound/") {
        return false;
    }

    // not fixed yet
    if path.contains("/oam_bug/") {
        return false;
    }

    // broken for DMG only
    if path.contains("halt_bug.gb") || path.contains("interrupt_time.gb") {
        return false;
    }

    // those tests don't output anything :/
    if path.contains("mem_timing-2") {
        return false;
    }

    true
}

fn get_tests() -> Vec<String> {
    let mut files = vec![];
    for entry in glob("./roms/gb-test-roms/**/*.gb").expect("Failed to read glob pattern") {
        match entry {
            Ok(path) => {
                let path = path.into_os_string().into_string().unwrap();
                if should_collect(&path) {
                    files.push(path);
                }
            }
            Err(e) => panic!("Glob file error, {:?}", e),
        }
    }
    files
}

fn execute_test_verbose(path: String) -> (String, bool, String) {
    let mut e = create_emulator(&path, Device::DMG);

    e.set_capture_serial(true);
    let max_frames_to_run = 3200; // cpu_instr takes long time

    let mut valid = false;
    let mut output: String = String::from("");

    // TODO check for a inifinite loop at the end of test?
    for _ in 0..max_frames_to_run {
        e.run_frame();

        output = e.hw.serial_output.iter().collect::<String>();
        if output.contains("Passed") {
            valid = true;
            break;
        }

        if output.contains("Failed") {
            valid = false;
            break;
        }
    }

    if !valid {
        println!("{} failed, output: {}", path, output);
    }

    (path, valid, output)
}

/// Runs only tests whose path contains `filter`, returns (path, valid, serial output)
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
        "Blargg's tests",
        &["https://github.com/retrio/gb-test-roms"],
        "Some tests are skipped, see `should_collect` in `blarggs_tests.rs` for the reasons.",
        &[],
        results,
    )
}
