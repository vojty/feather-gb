pub trait AudioDevice {
    fn queue(&mut self, buffer: &[f32]);
}