use gb::ppu::palettes::DmgPalettes;

use crate::{
    tests::{execute_tests, VisualTestCase, VisualTestCaseBuilder},
    utils::create_path,
};

const TEST_CASES: [(&str, &str, bool); 5] = [
    ("scxly", "scxly/scxly.gb", true),
    ("lycscx", "lycscx/lycscx.gb", true),
    ("lycscy", "lycscy/lycscy.gb", true),
    ("palettely", "palettely/palettely.gb", true),
    ("statcount", "statcount/statcount-auto.gb", false),
];

const TESTS_PATH: &str = "roms/scribbltests";

fn get_tests() -> Vec<VisualTestCase> {
    TEST_CASES
        .iter()
        .map(|(name, rom_base, copy_reference_image)| {
            let rom_path = create_path(&[TESTS_PATH, rom_base]);
            let reference_image = create_path(&[TESTS_PATH, name, "screenshots", "expected.png"]);
            VisualTestCaseBuilder::new(*name, rom_path, reference_image)
                .copy_reference(*copy_reference_image)
                .set_max_frames(250) // statcount-auto
                .set_palette(DmgPalettes::Green)
                .build()
        })
        .collect()
}

pub async fn run_tests() -> String {
    let tests = get_tests();

    execute_tests(
        "Scribbltests",
        "https://github.com/Hacktix/scribbltests",
        tests,
    )
    .await
}
