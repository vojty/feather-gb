use std::convert::TryInto;

use dasp::{
    interpolate::sinc::Sinc, ring_buffer::Slice, sample::ToSample,
    signal::from_interleaved_samples_iter, Signal,
};

use gb::{
    audio::AudioDevice,
    constants::{AUDIO_BUFFER_SIZE, AUDIO_SAMPLE_RATE},
};
use sdl2::{
    audio::{AudioQueue, AudioSpecDesired},
    Sdl,
};

const TARGET_AUDIO_SAMPLE_RATE: usize = 44100;
const HISTORY_SIZE: usize = 4;

pub struct Audio {
    queue: AudioQueue<f32>,
    buffer: [f32; AUDIO_BUFFER_SIZE * 2],
    prev_buffer: [f32; AUDIO_BUFFER_SIZE * 2],
    history: [f32; HISTORY_SIZE],
    dynamic_rate_control: bool,
}

impl Audio {
    pub fn new(sdl_context: Sdl) -> Self {
        let audio_subsystem = sdl_context.audio().unwrap();
        let audio_spec = AudioSpecDesired {
            freq: Some(TARGET_AUDIO_SAMPLE_RATE as i32),
            channels: Some(2),
            samples: None, //Some(AUDIO_BUFFER_SIZE as u16),
        };

        let queue = audio_subsystem.open_queue(None, &audio_spec).unwrap();
        queue.resume();

        Self {
            dynamic_rate_control: true,
            queue,
            buffer: [0.0; AUDIO_BUFFER_SIZE * 2],
            prev_buffer: [0.0; AUDIO_BUFFER_SIZE * 2],
            history: [0.0; HISTORY_SIZE],
        }
    }
}

impl AudioDevice for Audio {
    fn queue(&mut self, buffer_left: &[f32], buffer_right: &[f32]) {
        let mut i = 0;
        for pos in 0..buffer_left.len() {
            self.buffer[i] = buffer_left[pos];
            self.buffer[i + 1] = buffer_right[pos];
            i += 2;
        }

        if !self.dynamic_rate_control {
            self.queue.queue(&self.buffer);
            return;
        }

        println!(
            "Buffering, queue size = {}, status = {:?}",
            self.queue.size(),
            self.queue.status()
        );

        // TODO handle buffer overflow & underflow

        // if queue.size() > 20 * 1024 {
        //     println!("buffering, prev size={}, skip", queue.size());
        //     return;
        // } else {
        // }

        let from = AUDIO_SAMPLE_RATE;
        let to = TARGET_AUDIO_SAMPLE_RATE;

        // let a = [0.0f32].iter().cloned();
        let b = self.buffer.iter().cloned();
        let signal = from_interleaved_samples_iter(b);
        let ring_buffer = dasp::ring_buffer::Fixed::from(self.history);
        let sinc = Sinc::new(ring_buffer);
        let resampled = signal.from_hz_to_hz(sinc, from as f64, to as f64);
        let mut another_buf = Vec::with_capacity(1000);

        for frame in resampled.until_exhausted() {
            another_buf.push(frame);
        }

        let (_, end) = another_buf.split_at(another_buf.len() - HISTORY_SIZE);

        assert_eq!(end.len(), HISTORY_SIZE);
        self.history = end.try_into().unwrap();

        self.queue.queue(&another_buf);
        return;

        let data = self.buffer.clone();
        self.prev_buffer = data;
        self.queue.queue(&data);

        if self.queue.size() < 20 * 1024 {
            // self.queue.queue(&data);
        }
    }
}
