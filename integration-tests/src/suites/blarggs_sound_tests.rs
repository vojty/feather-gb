use gb::{emulator::Device, traits::MemoryAccess};

use crate::{
    tests::{
        execute_tests, get_image_path, ImageResultTypes, VisualTestCase, VisualTestCaseBuilder,
    },
    utils::create_path,
};

// Sound tests end with infinite loop stuck on JR i8
const INFINITE_LOOP_OP_CODE: u8 = 0x18; // JR i8

// ROM names use spaces instead of _
const TEST_CASES: &[&str] = &[
    "01-registers",
    "02-len_ctr",
    "03-trigger",
    "04-sweep",
    "05-sweep_details",
    "06-overflow_on_trigger",
    "07-len_sweep_period_sync",
    "08-len_ctr_during_power",
    "09-wave_read_while_on",
    "10-wave_trigger_while_on",
    "11-regs_after_power",
    "12-wave_write_while_on",
];

const TESTS_PATH: &str = "roms/gb-test-roms/dmg_sound/rom_singles";

fn get_tests() -> Vec<VisualTestCase> {
    TEST_CASES
        .iter()
        .map(|name| {
            let reference_path = get_image_path(name, ImageResultTypes::Expected);
            let rom_base = format!("{}.gb", name.replace('_', " "));
            let rom_path = create_path(&[TESTS_PATH, &rom_base]);
            VisualTestCaseBuilder::new(*name, rom_path, reference_path, Device::DMG)
                .copy_reference(false)
                .set_max_frames(2000)
                .set_end_callback(|e| {
                    let opcode = e.hw.read_byte(e.cpu.pc);
                    INFINITE_LOOP_OP_CODE == opcode
                })
                .build()
        })
        .collect()
}

pub async fn run_tests() -> String {
    let tests = get_tests();

    execute_tests(
        "Blargg's tests - dmg_sound",
        "https://github.com/retrio/gb-test-roms",
        tests,
    )
    .await
}
