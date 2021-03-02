use std::{fs::File, io::Read};

use glob::glob;
use regex::Regex;

fn get_file_as_byte_vec(filename: &str) -> Vec<u8> {
    let mut f = File::open(&filename).expect("no file found");

    let mut data = vec![];
    f.read_to_end(&mut data).unwrap();

    data
}

pub fn sanitize_name(filename: &str) -> String {
    // Mooneye's tests
    filename.replace("/tests/build", "")
}

pub trait BinarySource {
    fn get_binary(&self, callback: Box<dyn FnOnce(Vec<u8>)>);
    fn get_name(&self) -> &String;
}

#[derive(Clone)]
pub struct FileSystemRom {
    name: String,
    path: String,
}

impl BinarySource for FileSystemRom {
    fn get_binary(&self, callback: Box<dyn FnOnce(Vec<u8>)>) {
        let bytes = get_file_as_byte_vec(&self.path);
        (callback)(bytes);
    }

    fn get_name(&self) -> &String {
        &self.name
    }
}

pub fn load_roms() -> Vec<Box<dyn BinarySource>> {
    let mut files = vec![];

    for entry in glob("./roms/**/*.gb").expect("Failed to read glob pattern") {
        match entry {
            Ok(path) => files.push(path),
            Err(e) => log::debug!("Glob file error, {:?}", e),
        }
    }
    let regex = Regex::new("^roms/").unwrap();

    let paths = files
        .into_iter()
        .map(|path| {
            let path = path.into_os_string().into_string().unwrap();
            let name = regex.replace(&path, "").to_string();
            let name = sanitize_name(&name);
            let item: Box<dyn BinarySource> = Box::new(FileSystemRom { path, name });
            item
        })
        .collect::<Vec<Box<dyn BinarySource>>>();
    paths
}
