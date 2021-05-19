use crate::{
    markdown,
    tests::{get_image_path, ImageResultTypes, VisualTestCaseBuilder},
    utils::get_result_mark,
};

const TEST_PATH: &str = "roms/MBC3-Tester-gb/disassembly/game.gb";
const TEST_NAME: &str = "MBC3-Tester";

pub async fn run_tests() -> String {
    let test = VisualTestCaseBuilder::new(
        TEST_NAME,
        TEST_PATH,
        get_image_path(TEST_NAME, ImageResultTypes::Expected),
    )
    .copy_reference(false)
    .set_max_frames(50)
    .has_breakpoint(false)
    .build();

    let (name, reference_image, result_image, diff_image, diff) = test.create_result();

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
