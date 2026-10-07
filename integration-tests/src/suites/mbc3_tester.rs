use gb::emulator::Device;

use crate::{
    report::SuiteReport,
    tests::{execute_tests, get_image_path, ImageResultTypes, VisualTestCaseBuilder},
};

const TEST_PATH: &str = "roms/MBC3-Tester-gb/disassembly/game.gb";
const TEST_NAME: &str = "MBC3-Tester";

pub async fn run_tests() -> SuiteReport {
    let test = VisualTestCaseBuilder::new(
        TEST_NAME,
        TEST_PATH,
        get_image_path(TEST_NAME, ImageResultTypes::Expected),
        Device::DMG,
    )
    .copy_reference(false)
    .set_max_frames(50)
    .has_breakpoint(false)
    .build();

    execute_tests(
        "MBC3-Tester",
        &["https://github.com/EricKirschenmann/MBC3-Tester-gb"],
        "",
        vec![test],
    )
    .await
}
