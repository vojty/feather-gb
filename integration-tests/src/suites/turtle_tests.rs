use gb::emulator::Device;

use crate::{
    tests::{
        execute_tests, get_image_path, ImageResultTypes, VisualTestCase, VisualTestCaseBuilder,
    },
    utils::create_path,
};

const TEST_CASES: [(&str, &str); 2] = [
    ("window_y_trigger", "window_y_trigger/window_y_trigger.gb"),
    (
        "window_y_trigger_wx_offscreen",
        "window_y_trigger_wx_offscreen/window_y_trigger_wx_offscreen.gb",
    ),
];

const TESTS_PATH: &str = "roms/TurtleTests/src";

fn get_tests() -> Vec<VisualTestCase> {
    TEST_CASES
        .iter()
        .map(|(name, rom_base)| {
            let reference_path = get_image_path(name, ImageResultTypes::Expected);
            let rom_path = create_path(&[TESTS_PATH, rom_base]);
            VisualTestCaseBuilder::new(*name, rom_path, reference_path, Device::DMG)
                .copy_reference(false)
                .build()
        })
        .collect()
}

pub async fn run_tests() -> String {
    let tests = get_tests();

    execute_tests(
        "TurtleTests",
        "https://github.com/Powerlated/TurtleTests",
        tests,
    )
    .await
}
