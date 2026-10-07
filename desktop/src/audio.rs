use std::mem::size_of;

use gb::{
    audio::AudioDevice,
    constants::{AUDIO_BUFFER_SIZE, AUDIO_SAMPLE_RATE},
};
use sdl2::{
    audio::{AudioQueue, AudioSpecDesired},
    Sdl,
};

const CHANNELS: usize = 2;
// How much silence is queued ahead of new samples after an underrun (seconds)
const TARGET_LATENCY: f32 = 0.05;
// Samples which would be queued beyond this are dropped instead of adding latency (seconds)
const MAX_LATENCY: f32 = 0.2;

fn latency_to_floats(latency: f32) -> usize {
    (latency * AUDIO_SAMPLE_RATE as f32) as usize * CHANNELS
}

pub struct Audio {
    queue: AudioQueue<f32>,
}

impl Audio {
    pub fn new(sdl_context: &Sdl) -> Self {
        let audio_subsystem = sdl_context.audio().unwrap();
        let audio_spec = AudioSpecDesired {
            freq: Some(AUDIO_SAMPLE_RATE as i32),
            channels: Some(CHANNELS as u8),
            // Device buffer size in sample frames, it's an extra latency on top of the queue
            samples: Some((AUDIO_BUFFER_SIZE / CHANNELS) as u16),
        };

        let queue = audio_subsystem.open_queue(None, &audio_spec).unwrap();
        queue.resume();

        Self { queue }
    }
}

impl AudioDevice for Audio {
    fn queue(&mut self, buffer: &[f32]) {
        let queued = self.queue.size() as usize / size_of::<f32>();

        if queued == 0 {
            // Underrun, queue some silence first so the next chunk arrives before the queue drains again
            let silence = vec![0.0; latency_to_floats(TARGET_LATENCY)];
            self.queue.queue_audio(&silence).unwrap();
        } else if queued + buffer.len() > latency_to_floats(MAX_LATENCY) {
            // Emulation got ahead of playback (e.g. after a long LCD-off frame or clock drift)
            return;
        }

        self.queue.queue_audio(buffer).unwrap();
    }
}
