use futures::{future::join_all, TryFutureExt};

use gb::emulator::Device;
use glob::glob;

use crate::utils::get_result_mark;
use crate::{markdown, utils::create_emulator};

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

type TestResult = (String, bool); // (pathname, valid)

fn execute_test(path: String) -> TestResult {
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

    (path, valid)
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
        "Blargg's tests",
        "https://github.com/retrio/gb-test-roms\n\n Some of those tests are skipped, see `blarggs_tests.rs` why.",
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
