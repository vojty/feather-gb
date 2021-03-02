use std::{fs::File, io::Read};

pub fn get_file_as_byte_vec(filename: &str) -> Vec<u8> {
    let mut f = File::open(&filename).expect("no file found");

    let mut data = vec![];
    f.read_to_end(&mut data).unwrap();

    data
}

pub fn get_result_mark(valid: bool) -> String {
    if valid {
        String::from('✅')
    } else {
        String::from('❌')
    }
}
