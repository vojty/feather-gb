use std::fs;

use futures::future::join_all;
use tokio::task::JoinError;

use crate::{
    markdown,
    utils::{create_emulator, get_result_mark, save_diff_image, save_screen, OUTPUT_DIR},
};

struct TestCase {
    name: String,
    path: String,
    reference_image: String,
    result_image: String,
    diff_image: String,
}

const TEST_CASES: [(&str, &str); 4] = [
    ("scxly", "scxly/scxly.gb"),
    ("lycscx", "lycscx/lycscx.gb"),
    ("lycscy", "lycscy/lycscy.gb"),
    ("palettely", "palettely/palettely.gb"),
];

const TESTS_PATH: &str = "roms/scribbltests";

fn get_tests() -> Vec<TestCase> {
    TEST_CASES
        .iter()
        .map(|(test_name, file)| {
            let output_dir = format!("{}/{}", OUTPUT_DIR, test_name);
            let reference_original =
                format!("{}/{}/screenshots/expected.png", TESTS_PATH, test_name);
            let reference_image = format!("{}/expected.png", output_dir);

            fs::copy(&reference_original, &reference_image).unwrap();

            TestCase {
                name: test_name.to_string(),
                path: format!("{}/{}", TESTS_PATH, file),
                reference_image,
                result_image: format!("{}/result.png", output_dir),
                diff_image: format!("{}/diff.png", output_dir),
            }
        })
        .collect()
}

type TestResult = (String, String, String, String, usize); // (name, reference path, result path, diff path, diff)

fn execute_test(test_case: TestCase) -> TestResult {
    let TestCase {
        path,
        diff_image,
        name,
        reference_image,
        result_image,
    } = test_case;
    let mut e = create_emulator(&path);
    let max_frames_to_run = 60;

    for _ in 0..max_frames_to_run {
        e.run_frame();

        // Dummy check for LD B,B breakpoint
        if !e.hw.events.is_empty() {
            break;
        }
    }

    save_screen(&e, &result_image);
    let diff = save_diff_image(&reference_image, &result_image, &diff_image);

    (name, reference_image, result_image, diff_image, diff)
}

fn generate_test_report(results: Vec<Result<TestResult, JoinError>>) -> String {
    let data = results
        .iter()
        .filter_map(|result| match result {
            Ok((name, reference_image, result_image, diff_image, diff)) => Some(vec![
                name.clone(),
                markdown::image(reference_image),
                markdown::image(result_image),
                markdown::image(diff_image),
                format!("{} Diff: {}", get_result_mark(*diff == 0), diff),
            ]),
            Err(_) => None,
        })
        .collect::<Vec<Vec<String>>>();

    let headings = ["Name", "Expected", "Result", "Diff", "Status"];
    let result = markdown::table(&headings, &data);

    markdown::test_report(
        "Scribbltests",
        "https://github.com/Hacktix/scribbltests",
        &result,
    )
}

pub async fn run_tests() -> String {
    let files = get_tests();

    let mut handles = vec![];
    for file in files {
        let handle = tokio::spawn(async move { execute_test(file) });
        handles.push(handle);
    }

    let results = join_all(handles).await;
    generate_test_report(results)
}
