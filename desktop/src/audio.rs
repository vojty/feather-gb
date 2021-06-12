use gb::{
    audio::AudioDevice,
    constants::{AUDIO_BUFFER_SIZE, AUDIO_SAMPLE_RATE},
};
use sdl2::{
    audio::{AudioQueue, AudioSpecDesired},
    Sdl,
};

pub struct Audio {
    queue: AudioQueue<f32>,
}

impl Audio {
    pub fn new(sdl_context: Sdl) -> Self {
        let audio_subsystem = sdl_context.audio().unwrap();
        let audio_spec = AudioSpecDesired {
            freq: Some(AUDIO_SAMPLE_RATE as i32),
            channels: Some(2),
            samples: Some(AUDIO_BUFFER_SIZE as u16),
        };

        let queue = audio_subsystem.open_queue(None, &audio_spec).unwrap();
        queue.resume();

        Self { queue }
    }
}

impl AudioDevice for Audio {
    fn queue(&mut self, buffer: &[f32]) {
        println!("buffering, prev size={}", self.queue.size());
        // TODO handle buffer overflow & underflow

        // if queue.size() > 20 * 1024 {
        //     println!("buffering, prev size={}, skip", queue.size());
        //     return;
        // } else {
        // }

        self.queue.queue(buffer);
    }
}
