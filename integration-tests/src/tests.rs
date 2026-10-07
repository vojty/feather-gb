use gb::{
    emulator::{Device, Emulator},
    events::Events,
    ppu::palettes::DmgPalettes,
};

use crate::{
    markdown,
    report::{run_parallel, SuiteReport, TestRow},
    utils::{copy_file, create_emulator, create_path, save_diff_image, save_screen, OUTPUT_DIR},
};

pub struct VisualTestCaseBuilder {
    test: VisualTestCase,
}

type EndCallback = fn(&Emulator) -> bool;

impl VisualTestCaseBuilder {
    pub fn new(
        name: impl Into<String>,
        rom_path: impl Into<String>,
        reference_path: impl Into<String>,
        device: Device,
    ) -> Self {
        let test = VisualTestCase {
            name: name.into(),
            rom_path: rom_path.into(),
            reference_path: reference_path.into(),
            copy_reference: true,
            has_breakpoint: true,
            max_frames: 10,
            palette: DmgPalettes::Gray,
            end_callback: |_| false,
            device,
        };
        Self { test }
    }

    pub fn set_max_frames(mut self, frames: u32) -> Self {
        self.test.max_frames = frames;
        self
    }

    pub fn set_end_callback(mut self, callback: EndCallback) -> Self {
        self.test.end_callback = callback;
        self
    }

    pub fn set_palette(mut self, palette: DmgPalettes) -> Self {
        self.test.palette = palette;
        self
    }

    pub fn has_breakpoint(mut self, has_breakpoint: bool) -> Self {
        self.test.has_breakpoint = has_breakpoint;
        self
    }

    pub fn copy_reference(mut self, copy_reference: bool) -> Self {
        self.test.copy_reference = copy_reference;
        self
    }

    pub fn build(self) -> VisualTestCase {
        self.test
    }
}

pub struct VisualTestCase {
    name: String,

    rom_path: String,
    reference_path: String,
    device: Device,

    copy_reference: bool,
    max_frames: u32,
    has_breakpoint: bool,
    palette: DmgPalettes,

    end_callback: EndCallback,
}

pub enum ImageResultTypes {
    Result,
    Expected,
    Diff,
}

pub fn get_image_path(name: &str, file_type: ImageResultTypes) -> String {
    let filename = match file_type {
        ImageResultTypes::Diff => "diff.png",
        ImageResultTypes::Expected => "expected.png",
        ImageResultTypes::Result => "result.png",
    };
    create_path(&[OUTPUT_DIR, name, filename])
}

pub struct VisualTestResult {
    pub name: String,
    pub expected_path: String,
    pub result_path: String,
    pub diff_path: String,
    /// Number of different pixels
    pub diff: usize,
}

impl VisualTestResult {
    pub fn passed(&self) -> bool {
        self.diff == 0
    }

    fn into_row(self) -> TestRow {
        let passed = self.passed();
        TestRow::new(
            self.name,
            passed,
            vec![
                markdown::image(self.expected_path),
                markdown::image(self.result_path),
                markdown::image(self.diff_path),
                format!("{} px", self.diff),
            ],
        )
    }
}

/// Columns of [`VisualTestResult::into_row`]
pub const VISUAL_COLUMNS: &[&str] = &["Expected", "Result", "Diff", "Diff pixels"];

impl VisualTestCase {
    pub fn get_name(&self) -> &String {
        &self.name
    }

    pub fn get_rom_path(&self) -> &String {
        &self.rom_path
    }

    fn get_image_path(&self, file_type: ImageResultTypes) -> String {
        get_image_path(&self.name, file_type)
    }

    pub fn create_result(&self) -> VisualTestResult {
        let mut e = create_emulator(self.get_rom_path(), self.device);
        e.set_system_palette(&self.palette);

        // Copy original expected
        let expected_path = self.get_image_path(ImageResultTypes::Expected);
        if self.copy_reference {
            copy_file(&self.reference_path, &expected_path);
        }

        // Execute
        for _ in 0..self.max_frames {
            e.run_frame();

            // End callback check
            if (self.end_callback)(&e) {
                break;
            }

            // Check for magic breakpoint LD B,B
            if self.has_breakpoint && e.hw.events.contains(Events::MAGIC_BREAKPOINT) {
                break;
            }
        }

        // Save result
        let result_path = self.get_image_path(ImageResultTypes::Result);
        save_screen(&e, &result_path);

        // Generate and save diff
        let diff_path = self.get_image_path(ImageResultTypes::Diff);
        let diff = save_diff_image(&expected_path, &result_path, &diff_path);

        VisualTestResult {
            name: self.name.clone(),
            expected_path,
            result_path,
            diff_path,
            diff,
        }
    }
}

pub async fn execute_tests(
    name: &'static str,
    sources: &'static [&'static str],
    notes: &'static str,
    tests: Vec<VisualTestCase>,
) -> SuiteReport {
    let results = run_parallel(
        tests,
        |test| test.get_name().clone(),
        |test| test.create_result().into_row(),
    )
    .await;

    SuiteReport::new(name, sources, notes, VISUAL_COLUMNS, results)
}
