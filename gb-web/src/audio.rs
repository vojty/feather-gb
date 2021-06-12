use gb::audio::AudioDevice;
use js_sys::Function;
use wasm_bindgen::JsValue;

pub struct WebAudio {
    pub audio_buffer_callback: Function,
}

impl WebAudio {
    pub fn new(audio_buffer_callback: &js_sys::Function) -> Self {
        Self {
            audio_buffer_callback: audio_buffer_callback.clone(),
        }
    }
}

impl AudioDevice for WebAudio {
    fn queue(&mut self, buffer: &[f32]) {
        // Dummy audio device which just passes pointer to audio buffer to JS world
        let this = JsValue::null();
        let audio_buffer_ptr = JsValue::from(buffer.as_ptr() as u32);
        self.audio_buffer_callback
            .call1(&this, &audio_buffer_ptr)
            .unwrap();
    }
}
