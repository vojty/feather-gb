use eframe::egui::{self, Align, ScrollArea, TextStyle};
use egui::Ui;
use gb::{
    emulator::Emulator,
    traits::{DisplayHex, MemoryAccess},
};

#[derive(PartialEq, Copy, Clone)]
enum MemoryArea {
    CartridgeRom,
    CartridgeRam,
    Vram,
    Wram,
    WramShadow,
    Oam,
    Hram,
}

impl MemoryArea {
    fn get_range(&self) -> std::ops::RangeInclusive<usize> {
        match self {
            MemoryArea::CartridgeRom => 0x0000..=0x7fff,
            MemoryArea::CartridgeRam => 0xa000..=0xbfff,
            MemoryArea::Vram => 0xc000..=0xdfff,
            MemoryArea::Wram => 0xc000..=0xdfff,
            MemoryArea::WramShadow => 0xe000..=0xfdff,
            MemoryArea::Oam => 0xfe00..=0xfe9f,
            MemoryArea::Hram => 0xff80..=0xfffe,
        }
    }
    fn get_name(&self) -> String {
        match self {
            MemoryArea::CartridgeRom => "ROM".to_string(),
            MemoryArea::CartridgeRam => "RAM".to_string(),
            MemoryArea::Vram => "VRAM".to_string(),
            MemoryArea::Wram => "WRAM".to_string(),
            MemoryArea::WramShadow => "WRAM Shadow".to_string(),
            MemoryArea::Oam => "OAM".to_string(),
            MemoryArea::Hram => "HRAM".to_string(),
        }
    }
}

#[cfg_attr(feature = "persistence", derive(serde::Deserialize, serde::Serialize))]
#[cfg_attr(feature = "persistence", serde(default))]
#[derive(PartialEq)]
pub struct MemoryViewer {
    tack_item_align: Align,
    offset: f32,
    open: bool,
    memory_area: MemoryArea,
}

impl Default for MemoryViewer {
    fn default() -> Self {
        Self {
            tack_item_align: Align::Center,
            offset: 0.0,
            open: false,
            memory_area: MemoryArea::Oam,
        }
    }
}

impl MemoryViewer {
    pub fn show(&mut self, ctx: &egui::CtxRef, e: &Emulator, open: &mut bool) {
        egui::Window::new("Memory")
            .default_width(420.0)
            .open(open)
            .show(ctx, |ui| {
                self.ui(ui, e);
            });
    }

    pub fn ui(&mut self, ui: &mut Ui, e: &Emulator) {
        let mut scroll_top = false;
        let mut scroll_bottom = false;

        ui.horizontal(|ui| {
            scroll_top |= ui.button("Scroll to top").clicked();
            scroll_bottom |= ui.button("Scroll to bottom").clicked();
        });
        ui.end_row();

        ui.horizontal(|ui| {
            ui.label("Cartridge");
            [MemoryArea::CartridgeRom, MemoryArea::CartridgeRam]
                .iter()
                .for_each(|area| {
                    ui.selectable_value(&mut self.memory_area, *area, area.get_name());
                });
        });
        ui.end_row();
        ui.horizontal(|ui| {
            ui.label("System");
            [
                MemoryArea::Vram,
                MemoryArea::Wram,
                MemoryArea::WramShadow,
                MemoryArea::Oam,
                MemoryArea::Hram,
            ]
            .iter()
            .for_each(|area| {
                ui.selectable_value(&mut self.memory_area, *area, area.get_name());
            });
        });
        ui.end_row();

        let visible_height = 200.0;
        let scroll_area = ScrollArea::from_max_height(visible_height);

        ui.separator();
        scroll_area.show(ui, |ui| {
            if scroll_top {
                ui.scroll_to_cursor(Align::TOP);
            }

            if scroll_bottom {
                ui.scroll_to_cursor(Align::BOTTOM);
            }

            let step = 16;
            let range = self.memory_area.get_range();

            ui.vertical(|ui| {
                ui.style_mut().body_text_style = TextStyle::Monospace;
                for base_addr in range.step_by(step) {
                    let mut line = String::new();

                    line.push_str(&format!("0x{} |", (base_addr as u16).to_hex()));
                    for i in 0..step {
                        let addr = base_addr + i;
                        let byte = e.hw.read_byte(addr as u16);

                        line.push_str(&format!(" {}", byte.to_hex()));
                    }

                    ui.label(line);
                }
            });

            let margin = ui.visuals().clip_rect_margin;
            let current_scroll = ui.clip_rect().top() - ui.min_rect().top() + margin;
            let max_scroll = ui.min_rect().height() - ui.clip_rect().height() + 2.0 * margin;
            (current_scroll, max_scroll)
        });
        ui.separator();

        ui.vertical_centered(|ui| {
            egui::reset_button(ui, self);
        });
    }
}
