use eframe::egui::{Label, Response, RichText, Ui};

pub trait ExtendedUi {
    fn mono_label(&mut self, text: impl ToString) -> Response;
}

pub fn mono_label(text: impl ToString) -> Label {
    let text = RichText::new(text.to_string()).monospace();
    Label::new(text)
}

impl ExtendedUi for Ui {
    fn mono_label(&mut self, text: impl ToString) -> Response {
        let label = mono_label(text);
        self.add(label)
    }
}
