use crate::utils::OUTPUT_DIR;
use std::path::Path;

pub fn table(heading: &[&str], rows: &[Vec<String>]) -> String {
    fn wrap(content: String) -> String {
        format!("| {} |", content)
    }

    let cols = heading.len();

    // | h1 | h2 | h3 |
    let head = wrap(heading.join(" | "));

    // |-|-|
    let line = wrap(heading.iter().map(|_| "-").collect::<Vec<&str>>().join("|"));

    let body = rows
        .iter()
        .map(|row| {
            if row.len() != cols {
                panic!(
                    "Number of cols doesn't match. Expected {}, got {}",
                    cols,
                    row.len()
                );
            }
            wrap(row.join(" | "))
        })
        .collect::<Vec<String>>()
        .join("\n");

    format!("{}\n{}\n{}\n", head, line, body)
}

pub fn image(path: &str) -> String {
    let p = Path::new(path);
    let image_path = p.strip_prefix(OUTPUT_DIR).unwrap().to_str().unwrap();

    format!("![]({})", image_path)
}

pub fn test_report(name: &str, info: &str, result: &str) -> String {
    format!("## {}\n\n{}\n\n{}\n", name, info, result)
}
