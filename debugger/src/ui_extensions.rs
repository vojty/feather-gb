use eframe::egui::{Label, Response, TextStyle, Ui};

pub trait ExtendedUi {
    fn mono_label(&mut self, text: impl ToString) -> Response;
}

pub fn mono_label(text: impl ToString) -> Label {
    let label = Label::new(text.to_string());
    label.text_style(TextStyle::Monospace)
}

impl ExtendedUi for Ui {
    fn mono_label(&mut self, text: impl ToString) -> Response {
        let label = mono_label(text);
        self.add(label)
    }
}
