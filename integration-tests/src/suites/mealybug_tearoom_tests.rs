use std::path::Path;

use futures::{future::join_all, TryFutureExt};
use glob::glob;

use crate::{
    markdown,
    utils::{
        copy_file, create_emulator, get_result_mark, path_to_basename, save_diff_image,
        save_screen, OUTPUT_DIR,
    },
};

struct TestCase {
    name: String,
    path: String,
    reference_image: String,
    result_image: String,
    diff_image: String,
}

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

fn get_tests() -> Vec<TestCase> {
    get_files()
        .into_iter()
        .map(|(test_name, path)| {
            let output_dir = format!("{}/{}", OUTPUT_DIR, test_name);
            let reference_original = get_reference_image_path(&test_name);
            let reference_image = format!("{}/expected.png", output_dir);

            copy_file(&reference_original, &reference_image);

            TestCase {
                name: test_name,
                path,
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
    let max_frames_to_run = 20;

    for _ in 0..max_frames_to_run {
        e.run_frame();
    }

    save_screen(&e, &result_image);
    let diff = save_diff_image(&reference_image, &result_image, &diff_image);

    (name, reference_image, result_image, diff_image, diff)
}

fn generate_test_report(results: Vec<Result<TestResult, String>>) -> String {
    let data = results
        .into_iter()
        .map(|result| match result {
            Ok((name, reference_image, result_image, diff_image, diff)) => vec![
                name,
                markdown::image(reference_image),
                markdown::image(result_image),
                markdown::image(diff_image),
                format!("{} Diff: {}", get_result_mark(diff == 0), diff),
            ],
            Err(test_name) => vec![test_name, format!("{} (crashes)", get_result_mark(false))],
        })
        .collect::<Vec<Vec<String>>>();

    let headings = ["Name", "Expected", "Result", "Diff", "Status"];
    let result = markdown::table(&headings, &data);

    markdown::test_report(
        "Mealybug Tearoom Tests",
        "https://github.com/mattcurrie/mealybug-tearoom-tests",
        &result,
    )
}

pub async fn run_tests() -> String {
    let files = get_tests();

    let mut handles = vec![];
    for file in files {
        let name = file.name.clone();
        let handle = tokio::spawn(async move { execute_test(file) }).map_err(|_| name);
        handles.push(handle);
    }

    let results = join_all(handles).await;
    generate_test_report(results)
}
