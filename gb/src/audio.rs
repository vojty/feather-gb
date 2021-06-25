pub trait AudioDevice {
    fn queue(&mut self, buffer_left: &[f32], buffer_right: &[f32]);
}
