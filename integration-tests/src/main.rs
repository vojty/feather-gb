use std::{fs, process::Command};

use suites::mooneye_tests;
use suites::scribbl_tests;
use tokio::time::Instant;
use utils::OUTPUT_DIR;

mod markdown;
mod suites;
mod utils;

#[tokio::main]
pub async fn main() {
    let now = Instant::now();

    let scribbl_tests = scribbl_tests::run_tests().await;
    let mooneye_tests = mooneye_tests::run_tests().await;
    let output_file = format!("{}/results.md", OUTPUT_DIR);

    let generated_at = format!("Generated at: {}", chrono::offset::Utc::now());

    fs::write(
        &output_file,
        [scribbl_tests, mooneye_tests, generated_at].join("\n\n"),
    )
    .unwrap();

    // Format markdown with prettier
    let mut child = Command::new("./node_modules/.bin/prettier")
        .arg("--write")
        .arg(OUTPUT_DIR)
        .spawn()
        .unwrap();

    child.wait().unwrap();

    println!(
        "Done in {}s, results: {}",
        now.elapsed().as_secs(),
        output_file
    )
}
