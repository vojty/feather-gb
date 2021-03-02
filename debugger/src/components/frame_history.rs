use eframe::egui::util::History;

// taken from https://github.com/emilk/egui/blob/master/egui_demo_lib/src/frame_history.rs

pub struct FrameHistory {
    frame_times: History<f32>,
}

impl FrameHistory {
    pub fn new() -> Self {
        let max_age: f64 = 1.0;
        Self {
            frame_times: History::from_max_len_age((max_age * 300.0).round() as usize, max_age),
        }
    }

    pub fn on_new_frame(&mut self, now: f64, previous_frame_time: Option<f32>) {
        let previous_frame_time = previous_frame_time.unwrap_or_default();
        if let Some(latest) = self.frame_times.latest_mut() {
            *latest = previous_frame_time; // rewrite history now that we know
        }
        self.frame_times.add(now, previous_frame_time); // projected
    }

    pub fn fps(&self) -> u32 {
        let fps = 1.0 / self.frame_times.mean_time_interval().unwrap_or_default();
        fps as u32
    }
}
