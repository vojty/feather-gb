use std::cmp::{max, min};

use eframe::egui;

const MIN_SCALE: usize = 1;
const MAX_SCALE: usize = 4;
const STEP: usize = 1;

pub fn render_scale(ui: &mut egui::Ui, scale: &mut usize) {
    ui.horizontal(|ui| {
        ui.label("Scale:");
        if ui.button("-").clicked() {
            *scale = max(*scale - STEP, MIN_SCALE);
        }
        ui.label(scale.to_string());
        if ui.button("+").clicked() {
            *scale = min(*scale + STEP, MAX_SCALE);
        }
    });
}
