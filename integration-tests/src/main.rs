use suites::mooneye_tests;
use suites::scribbl_tests;

mod markdown;
mod suites;
mod utils;

#[tokio::main]
pub async fn main() {
    scribbl_tests::run_tests().await;
    mooneye_tests::run_tests().await;
}
