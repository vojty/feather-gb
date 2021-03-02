use debugger::utils::{sanitize_name, BinarySource};
use egui_web::spawn_future;
use serde::Deserialize;
use wasm_bindgen::{prelude::*, JsCast};
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit};

#[derive(Deserialize, Clone, Debug)]
pub struct WebRom {
    name: String,
    url: String,
}

impl WebRom {
    fn sanitize_name(&mut self) {
        self.name = sanitize_name(&self.name);
    }
}

// Creates window.fetch request and returns binary data as Vec<u8>
async fn load_data(url: &str) -> Result<Vec<u8>, JsValue> {
    let mut opts = RequestInit::new();
    opts.method("GET");

    let request = Request::new_with_str_and_init(&url, &opts)?;

    let window = web_sys::window().unwrap();
    let response = JsFuture::from(window.fetch_with_request(&request)).await?;
    assert!(response.is_instance_of::<web_sys::Response>());
    let response: web_sys::Response = response.dyn_into().unwrap();

    let array_buffer = JsFuture::from(response.array_buffer()?).await?;
    let uint8_array = js_sys::Uint8Array::new(&array_buffer);
    let bytes = uint8_array.to_vec();

    Ok(bytes)
}

impl BinarySource for WebRom {
    fn get_binary(&self, open_callback: Box<dyn FnOnce(Vec<u8>)>) {
        let data = self.clone();
        spawn_future(async move {
            let result = load_data(&data.url).await;
            match result {
                Ok(binary) => open_callback(binary),
                Err(_) => panic!("Can't load {} from {}", data.name, data.url),
            }
        });
    }

    fn get_name(&self) -> &String {
        &self.name
    }
}

pub fn collect_files(data: JsValue) -> Vec<Box<dyn BinarySource>> {
    let files: Vec<WebRom> = serde_wasm_bindgen::from_value(data).unwrap();

    let roms: Vec<Box<dyn BinarySource>> = files
        .into_iter()
        .map(|mut r| {
            r.sanitize_name();
            Box::new(r) as Box<dyn BinarySource>
        })
        .collect::<Vec<Box<dyn BinarySource>>>();

    roms
}
