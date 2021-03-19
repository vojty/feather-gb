use crate::{
    markdown,
    utils::{create_emulator, get_result_mark, save_diff_image, save_screen, OUTPUT_DIR},
};

pub struct VisualTestCase {
    name: String,
    path: String,
    reference_image: String,
    result_image: String,
    diff_image: String,
}

const TEST_PATH: &str = "roms/MBC3-Tester-gb/disassembly/game.gb";
const TEST_NAME: &str = "MBC3-Tester";

type TestResult = (String, String, String, String, usize); // (name, reference path, result path, diff path, diff)

fn execute_test(test_case: VisualTestCase) -> TestResult {
    let VisualTestCase {
        path,
        diff_image,
        name,
        reference_image,
        result_image,
    } = test_case;
    let mut e = create_emulator(&path);
    let frames_to_run = 50;

    for _ in 0..frames_to_run {
        e.run_frame();
    }

    save_screen(&e, &result_image);
    let diff = save_diff_image(&reference_image, &result_image, &diff_image);

    (name, reference_image, result_image, diff_image, diff)
}

pub async fn run_tests() -> String {
    let output_dir = format!("{}/{}", OUTPUT_DIR, TEST_NAME);

    let test = VisualTestCase {
        name: TEST_NAME.to_string(),
        path: TEST_PATH.to_string(),
        reference_image: format!("{}/expected.png", output_dir),
        result_image: format!("{}/result.png", output_dir),
        diff_image: format!("{}/diff.png", output_dir),
    };

    let (name, reference_image, result_image, diff_image, diff) = execute_test(test);

    let headings = ["Name", "Expected", "Result", "Diff", "Status"];
    let result = markdown::table(
        &headings,
        &[vec![
            name,
            markdown::image(reference_image),
            markdown::image(result_image),
            markdown::image(diff_image),
            format!("{} Diff: {}", get_result_mark(diff == 0), diff),
        ]],
    );

    markdown::test_report(
        "MBC3-Tester",
        "https://github.com/EricKirschenmann/MBC3-Tester-gb",
        &result,
    )
}
