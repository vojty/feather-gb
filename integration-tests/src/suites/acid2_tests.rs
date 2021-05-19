use crate::tests::{execute_tests, VisualTestCase, VisualTestCaseBuilder};

const TEST_CASES: [(&str, &str, &str); 2] = [
    (
        "dmg-acid2",
        "roms/dmg-acid2/build/dmg-acid2.gb",
        "roms/dmg-acid2/img/reference-dmg.png",
    ),
    (
        "cgb-acid2",
        "roms/cgb-acid2/build/cgb-acid2.gbc",
        "roms/cgb-acid2/img/reference.png",
    ),
];

fn get_tests() -> Vec<VisualTestCase> {
    TEST_CASES
        .iter()
        .map(|(name, rom_path, refeference_path)| {
            VisualTestCaseBuilder::new(*name, *rom_path, *refeference_path)
                .set_max_frames(20)
                .build()
        })
        .collect()
}

pub async fn run_tests() -> String {
    let tests = get_tests();

    execute_tests(
        "acid2 tests",
        "
- https://github.com/mattcurrie/dmg-acid2
- https://github.com/mattcurrie/cgb-acid2
    ",
        tests,
    )
    .await
}
