use std::{
    fs,
    process::{Command, Stdio},
};

use futures::future::join_all;
use suites::{
    acid2_tests, age_tests, blarggs_sound_tests, blarggs_tests, gbmicrotest, mbc3_tester,
    mealybug_tearoom_tests, scribbl_tests, wilbertpol_tests,
};
use suites::{mooneye_tests, turtle_tests};
use tokio::time::Instant;
use utils::OUTPUT_DIR;

mod markdown;
mod suites;
mod tests;
mod utils;

/// Quick mode: `cargo run -p integration-tests -- <suite> [filter]`
/// Runs only the matching tests of a single suite, prints results and doesn't touch `docs/results`.
fn run_cli(suite: &str, filter: &str) {
    let results = match suite {
        "wilbertpol" => wilbertpol_tests::run_filtered(filter),
        "mooneye" => mooneye_tests::run_filtered(filter),
        "blargg" => blarggs_tests::run_filtered(filter),
        "age" => age_tests::run_filtered(filter),
        "mealybug" => mealybug_tearoom_tests::run_filtered(filter),
        "gbmicrotest" => gbmicrotest::run_filtered(filter),
        _ => panic!(
            "Unknown suite '{}', use wilbertpol|mooneye|blargg|age|mealybug|gbmicrotest",
            suite
        ),
    };

    let mut results = results;
    results.sort_by(|a, b| a.0.cmp(&b.0));
    let passed = results.iter().filter(|(_, valid, _)| *valid).count();
    for (path, valid, details) in &results {
        if *valid {
            println!("✅ {}", path);
        } else {
            println!("❌ {}  [{}]", path, details.trim());
        }
    }
    println!("{}/{} passed", passed, results.len());
}

/// Counts ✅/❌ table rows of each suite report and renders an overview table.
fn summary(reports: &[String]) -> String {
    fn anchor(heading: &str) -> String {
        heading
            .to_lowercase()
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == ' ' || *c == '-' || *c == '_')
            .map(|c| if c == ' ' { '-' } else { c })
            .collect()
    }

    let mut rows = Vec::new();
    let (mut total_passed, mut total) = (0, 0);

    for report in reports {
        let Some(name) = report.lines().find_map(|l| l.strip_prefix("## ")) else {
            continue;
        };
        let test_rows = report.lines().filter(|l| l.starts_with('|'));
        let (passed, failed) = test_rows.fold((0, 0), |(p, f), l| {
            if l.contains('✅') {
                (p + 1, f)
            } else if l.contains('❌') {
                (p, f + 1)
            } else {
                (p, f)
            }
        });
        let count = passed + failed;
        total_passed += passed;
        total += count;

        let status = if failed == 0 { "✅" } else { "❌" };
        rows.push(vec![
            format!("[{}](#{})", name, anchor(name)),
            format!("{}/{}", passed, count),
            percent(passed, count),
            status.to_string(),
        ]);
    }

    rows.push(vec![
        "**Total**".to_string(),
        format!("**{}/{}**", total_passed, total),
        format!("**{}**", percent(total_passed, total)),
        String::new(),
    ]);

    format!(
        "# Test results\n\nPassing **{} out of {}** tests ({}).\n\n{}",
        total_passed,
        total,
        percent(total_passed, total),
        markdown::table(&["Suite", "Passed", "%", "Status"], &rows)
    )
}

fn percent(passed: usize, total: usize) -> String {
    if total == 0 {
        return "-".to_string();
    }
    format!("{:.1}%", passed as f64 * 100.0 / total as f64)
}

#[tokio::main]
pub async fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        let filter = args.get(2).map(String::as_str).unwrap_or("");
        run_cli(&args[1], filter);
        return;
    }

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
        tokio::spawn(gbmicrotest::run_tests()),
    ];

    let results = join_all(suites).await;
    let mut content = results
        .into_iter()
        .filter_map(|result| result.ok())
        .collect::<Vec<String>>();

    content.insert(0, summary(&content));

    let output_file = format!("{}/results.md", OUTPUT_DIR);
    let generated_at = format!(
        "Generated at: {}, took {}s",
        chrono::offset::Utc::now(),
        now.elapsed().as_secs()
    );

    content.push(generated_at);

    fs::write(&output_file, content.join("\n\n")).unwrap();

    // Format markdown with prettier
    let mut child = Command::new("./node_modules/.bin/oxfmt")
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
