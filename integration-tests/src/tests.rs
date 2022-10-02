use futures::{future::join_all, TryFutureExt};

use gb::{
    emulator::{Device, Emulator},
    events::Events,
    ppu::palettes::DmgPalettes,
};

use crate::{
    markdown,
    utils::{
        copy_file, create_emulator, create_path, get_result_mark, save_diff_image, save_screen,
        OUTPUT_DIR,
    },
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

type TestResult = (String, String, String, String, usize); // (name, reference path, result path, diff path, diff)

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

    pub fn create_result(&self) -> TestResult {
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

        (
            self.name.clone(),
            expected_path,
            result_path,
            diff_path,
            diff,
        )
    }
}

fn generate_table(results: Vec<Result<TestResult, String>>) -> String {
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
    markdown::table(&headings, &data)
}

pub async fn execute_tests(
    name: impl Into<String>,
    info: impl Into<String>,
    tests: Vec<VisualTestCase>,
) -> String {
    let mut handles = vec![];
    for test in tests {
        let name = test.get_name().clone();
        let handle = tokio::spawn(async move { test.create_result() }).map_err(|_| name);
        handles.push(handle);
    }

    let results = join_all(handles).await;
    let md_table = generate_table(results);

    markdown::test_report(&name.into(), &info.into(), &md_table)
}
