use std::{
    fs,
    process::{Command, Stdio},
};

use futures::future::join_all;
use suites::{
    acid2_tests, age_tests, blarggs_sound_tests, blarggs_tests, mbc3_tester,
    mealybug_tearoom_tests, scribbl_tests, wilbertpol_tests,
};
use suites::{mooneye_tests, turtle_tests};
use tokio::time::Instant;
use utils::OUTPUT_DIR;

mod markdown;
mod suites;
mod tests;
mod utils;

#[tokio::main]
pub async fn main() {
    let now = Instant::now();

    let suites = vec![
        tokio::spawn(blarggs_tests::run_tests()),
        tokio::spawn(blarggs_sound_tests::run_tests()),
        tokio::spawn(mooneye_tests::run_tests()),
        tokio::spawn(wilbertpol_tests::run_tests()),
        tokio::spawn(acid2_tests::run_tests()),
        tokio::spawn(scribbl_tests::run_tests()),
        tokio::spawn(turtle_tests::run_tests()),
        tokio::spawn(mbc3_tester::run_tests()),
        tokio::spawn(mealybug_tearoom_tests::run_tests()),
        tokio::spawn(age_tests::run_tests()),
    ];

    let results = join_all(suites).await;
    let mut content = results
        .into_iter()
        .filter_map(|result| result.ok())
        .collect::<Vec<String>>();

    let output_file = format!("{}/results.md", OUTPUT_DIR);
    let generated_at = format!(
        "Generated at: {}, took {}s",
        chrono::offset::Utc::now(),
        now.elapsed().as_secs()
    );

    content.push(generated_at);

    fs::write(&output_file, content.join("\n\n")).unwrap();

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
