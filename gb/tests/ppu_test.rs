mod tests {
    use gb::{
        interrupts::InterruptController,
        ppu::ppu::{Mode, Ppu},
    };
    trait DebugInfo {
        fn get_cycles(&self) -> u32;
        fn get_stat_mode(&self) -> Mode;
        fn execute_cycles(&mut self, cycles: usize);
        fn prepare(&mut self, line: u8);
        fn assert_stat_mode(&self, mode: Mode);
    }

    impl DebugInfo for Ppu {
        fn get_cycles(&self) -> u32 {
            self.line_clocks
        }

        fn get_stat_mode(&self) -> Mode {
            let stat = self.read_byte(0xff41);
            Mode::from_bits(stat)
        }

        fn execute_cycles(&mut self, cycles: usize) {
            let mut ic = InterruptController::new();
            (0..cycles).for_each(|_| self.tick(&mut ic));
        }

        fn prepare(&mut self, line: u8) {
            self.execute_cycles(1); // move from cycle 0

            loop {
                self.execute_cycles(1);
                if self.line == line && self.line_clocks == 0 {
                    break;
                }
            }
        }

        fn assert_stat_mode(&self, mode: Mode) {
            assert_eq!(
                self.get_stat_mode(),
                mode,
                "Cycle {} is expected to be mode {}",
                self.get_cycles(),
                mode
            );
        }
    }

    const M2_CYCLES: usize = 80;
    const M3_CYCLES: usize = 172; // shortest variant, without scroll and sprites = 160 cycles for each pixel + 12 cycles for initial fetch
    const M0_CYCLES: usize = 204;

    #[test]
    fn basic_mode_transitions() {
        let mut ppu = Ppu::new(false);

        ppu.init_without_bios();

        // LINE 0
        ppu.prepare(0);

        assert_eq!(M2_CYCLES + M3_CYCLES + M0_CYCLES, 456);

        // Cycle 0, mode=0 HBlank
        assert_eq!(ppu.get_cycles() as usize, 0);
        assert_eq!(ppu.mode, Mode::OamSearch);

        ppu.assert_stat_mode(Mode::HBlank);

        // Cycle 1, mode=2 OAM
        // 0 -> 80
        for _cycle in 0..M2_CYCLES {
            ppu.execute_cycles(1);
            ppu.assert_stat_mode(Mode::OamSearch);
        }

        // 81 -> 252
        for _cycle in 0..M3_CYCLES {
            ppu.execute_cycles(1);
            ppu.assert_stat_mode(Mode::PixelTransfer); // stat mode m=3
        }

        // Cycle 455
        ppu.execute_cycles(M0_CYCLES - 1);
        ppu.assert_stat_mode(Mode::HBlank);

        // Cycle 0 line 1
        ppu.execute_cycles(1);
        assert_eq!(ppu.get_cycles() as usize, 0);
        ppu.assert_stat_mode(Mode::HBlank);
    }
}
