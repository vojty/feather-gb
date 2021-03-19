use std::{
    fs,
    process::{Command, Stdio},
};

use suites::{blarggs_tests, mbc3_tester, scribbl_tests};
use suites::{mooneye_tests, turtle_tests};
use tokio::time::Instant;
use utils::OUTPUT_DIR;

mod markdown;
mod suites;
mod utils;

#[tokio::main]
pub async fn main() {
    let now = Instant::now();

    let blarggs_test = blarggs_tests::run_tests().await;
    let scribbl_tests = scribbl_tests::run_tests().await;
    let turtle_tests = turtle_tests::run_tests().await;
    let mooneye_tests = mooneye_tests::run_tests().await;
    let mbc3_tester = mbc3_tester::run_tests().await;

    let output_file = format!("{}/results.md", OUTPUT_DIR);

    let generated_at = format!("Generated at: {}", chrono::offset::Utc::now());

    fs::write(
        &output_file,
        [
            blarggs_test,
            mooneye_tests,
            scribbl_tests,
            turtle_tests,
            mbc3_tester,
            generated_at,
        ]
        .join("\n\n"),
    )
    .unwrap();

    // Format markdown with prettier
    let mut child = Command::new("./node_modules/.bin/prettier")
        .arg("--write")
        .arg(OUTPUT_DIR)
        .stdout(Stdio::null()) // hide succces
        .spawn()
        .unwrap();

    child.wait().unwrap();

    println!(
        "Done in {}s, results: {}",
        now.elapsed().as_secs(),
        output_file
    )
}
