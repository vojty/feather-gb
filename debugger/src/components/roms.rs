use eframe::egui::{self, ScrollArea};
use fuzzy_matcher::skim::SkimMatcherV2;
use fuzzy_matcher::FuzzyMatcher;

use crate::utils::BinarySource;

pub struct Roms {
    roms: Vec<Box<dyn BinarySource>>,
    search: String,
    matcher: SkimMatcherV2,
}

impl Roms {
    pub fn new(roms: Vec<Box<dyn BinarySource>>) -> Self {
        Self {
            roms,
            search: String::new(),
            matcher: SkimMatcherV2::default(),
        }
    }

    pub fn show<F>(&mut self, ctx: &egui::CtxRef, open: &mut bool, mut open_callback: F)
    where
        F: FnMut(&Box<dyn BinarySource>),
    {
        egui::Window::new(format!("ROMs ({})", self.roms.len()))
            .resizable(false)
            .open(open)
            .show(ctx, |ui| {
                ui.horizontal(|ui| {
                    ui.add(egui::TextEdit::singleline(&mut self.search).hint_text("Search"));
                    if ui.button("×").clicked() {
                        self.search = String::new();
                    }
                });

                ScrollArea::from_max_height(200.0).show(ui, |ui| {
                    ui.vertical(|ui| {
                        self.get_roms().iter().for_each(|&rom| {
                            ui.horizontal(|ui| {
                                if ui.button("Open").clicked() {
                                    open_callback(rom);
                                }

                                ui.label(rom.get_name());
                            });
                        });
                    });
                });
                ui.separator();
            });
    }

    // Keep Box for dynamic
    #[allow(clippy::borrowed_box)]
    fn get_roms(&self) -> Vec<&Box<dyn BinarySource>> {
        let mut results = self
            .roms
            .iter()
            // collect results with score
            .filter_map(
                |rom| match self.matcher.fuzzy_indices(&rom.get_name(), &self.search) {
                    Some((score, _)) => Some((score, rom)),
                    _ => None,
                },
            )
            .collect::<Vec<(i64, &Box<dyn BinarySource>)>>();

        // Sort by score
        results.sort_by(|a, b| b.0.cmp(&a.0));

        let sorted = results
            .into_iter()
            .map(|(_, rom)| rom)
            .collect::<Vec<&Box<dyn BinarySource>>>();
        sorted
    }
}
