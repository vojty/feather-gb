use futures::{future::join_all, TryFutureExt};

use crate::markdown;

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Status {
    Passed,
    Failed,
    Crashed,
}

impl Status {
    pub fn from_passed(passed: bool) -> Self {
        if passed {
            Status::Passed
        } else {
            Status::Failed
        }
    }

    fn mark(self) -> &'static str {
        match self {
            Status::Passed => "✅",
            Status::Failed => "❌",
            Status::Crashed => "❌ (crashed)",
        }
    }
}

/// One table row: `| name | status | columns... |`
pub struct TestRow {
    pub name: String,
    pub status: Status,
    pub columns: Vec<String>,
}

impl TestRow {
    pub fn new(name: impl Into<String>, passed: bool, columns: Vec<String>) -> Self {
        Self {
            name: name.into(),
            status: Status::from_passed(passed),
            columns,
        }
    }
}

pub struct SuiteReport {
    pub name: &'static str,
    pub sources: &'static [&'static str],
    pub notes: &'static str,
    /// Headings of the suite specific columns following `Test` and `Status`
    pub columns: &'static [&'static str],
    pub rows: Vec<TestRow>,
}

impl SuiteReport {
    /// Turns results of [`run_parallel`] into rows, a crashed test gets an empty row.
    pub fn new(
        name: &'static str,
        sources: &'static [&'static str],
        notes: &'static str,
        columns: &'static [&'static str],
        results: Vec<Result<TestRow, String>>,
    ) -> Self {
        let rows = results
            .into_iter()
            .map(|result| {
                result.unwrap_or_else(|name| TestRow {
                    name,
                    status: Status::Crashed,
                    columns: vec![String::new(); columns.len()],
                })
            })
            .collect();

        Self {
            name,
            sources,
            notes,
            columns,
            rows,
        }
    }

    pub fn passed(&self) -> usize {
        self.rows
            .iter()
            .filter(|row| row.status == Status::Passed)
            .count()
    }

    pub fn total(&self) -> usize {
        self.rows.len()
    }

    fn anchor(&self) -> String {
        self.name
            .to_lowercase()
            .chars()
            .filter(|c| c.is_alphanumeric() || matches!(c, ' ' | '-' | '_'))
            .map(|c| if c == ' ' { '-' } else { c })
            .collect()
    }

    pub fn to_markdown(&self) -> String {
        let mut sections = vec![format!("## {}", self.name)];

        let sources = match self.sources {
            [source] => format!("Source: {}", source),
            sources => {
                let list = sources
                    .iter()
                    .map(|source| format!("- {}", source))
                    .collect::<Vec<String>>()
                    .join("\n");
                format!("Sources:\n\n{}", list)
            }
        };
        sections.push(sources);

        if !self.notes.is_empty() {
            sections.push(self.notes.to_string());
        }

        sections.push(format!(
            "**Passed {}/{} ({})**",
            self.passed(),
            self.total(),
            percent(self.passed(), self.total())
        ));

        let headings = [&["Test", "Status"], self.columns].concat();
        let rows = self
            .rows
            .iter()
            .map(|row| {
                [
                    vec![row.name.clone(), row.status.mark().to_string()],
                    row.columns.clone(),
                ]
                .concat()
            })
            .collect::<Vec<Vec<String>>>();
        sections.push(markdown::table(&headings, &rows));

        sections.join("\n\n")
    }
}

/// Overview table of all suites with links to their sections.
pub fn summary(reports: &[SuiteReport]) -> String {
    let passed: usize = reports.iter().map(SuiteReport::passed).sum();
    let total: usize = reports.iter().map(SuiteReport::total).sum();

    let mut rows = reports
        .iter()
        .map(|report| {
            let status = Status::from_passed(report.passed() == report.total());
            vec![
                format!("[{}](#{})", report.name, report.anchor()),
                format!("{}/{}", report.passed(), report.total()),
                percent(report.passed(), report.total()),
                status.mark().to_string(),
            ]
        })
        .collect::<Vec<Vec<String>>>();

    rows.push(vec![
        "**Total**".to_string(),
        format!("**{}/{}**", passed, total),
        format!("**{}**", percent(passed, total)),
        String::new(),
    ]);

    format!(
        "# Test results\n\nPassing **{} out of {}** tests ({}).\n\n{}",
        passed,
        total,
        percent(passed, total),
        markdown::table(&["Suite", "Passed", "%", "Status"], &rows)
    )
}

fn percent(passed: usize, total: usize) -> String {
    if total == 0 {
        return "-".to_string();
    }
    format!("{:.1}%", passed as f64 * 100.0 / total as f64)
}

/// Runs every test on its own task, a panicking test is reported as `Err(name)`.
pub async fn run_parallel<T, F>(
    tests: Vec<T>,
    name: fn(&T) -> String,
    run: F,
) -> Vec<Result<TestRow, String>>
where
    T: Send + 'static,
    F: Fn(T) -> TestRow + Copy + Send + 'static,
{
    let handles = tests.into_iter().map(|test| {
        let name = name(&test);
        tokio::spawn(async move { run(test) }).map_err(|_| name)
    });
    join_all(handles).await
}
