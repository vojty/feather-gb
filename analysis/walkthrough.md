# Walkthrough: Game Boy DMG PPU Event Timing Analysis

We have completed the comprehensive cycle-accurate timing analysis of the Game Boy PPU event timing tests for monochrome models (DMG/MGB/SGB).

## What Was Accomplished

1.  **Focused Exclusively on DMG (GS Suffix)**:
    *   Filtered out and skipped all CGB/C-suffix timing tests, focusing 100% on original DMG hardware accuracy.
2.  **Analyzed Core `ly*` Test Files**:
    *   `ly_lyc-GS.s`: General coincidence and STAT interrupt timing, documenting the 1 M-cycle early LY increment quirk.
    *   `ly_lyc_0-GS.s` / `ly_new_frame-GS.s`: Transition from scanline 153 to 0, documenting the 4 T-cycle scanline 153 duration quirk, Mode 1 $\rightarrow$ Mode 0 $\rightarrow$ Mode 2 scanline 0 transition timeline, and extended `LY = 0` duration (908 T-cycles).
    *   `ly143_144_145.s` / `ly143_144_152_153.s` / `ly143_144_mode0_1.s` / `ly143_144_mode3_0.s`: Analyzed transitions at V-Blank entry (line 143 $\rightarrow$ 144) and verified that all intermediate V-Blank lines last exactly 456 T-cycles.
    *   `ly00_mode0_2-GS.s` / `ly00_mode1_0-GS.s` / `ly00_01_mode0_2.s` / `ly00_mode2_3.s` / `ly00_mode3_0.s`: Analyzed transitions on scanline 0, verifying Mode 2, Mode 3, and Mode 0 durations and start cycles.
    *   `ly_lyc_write-GS.s` / `ly_lyc_0_write-GS.s` / `ly_lyc_153_write-GS.s`: Documented register write timing behaviors to `LYC` and how writing to `LYC` interacts with the comparison latch window.
3.  **Analyzed PPU Startup Timing (`lcdon_timing-GS.s`)**:
    *   Added a detailed comparative analysis verifying the cycle-by-cycle behavior of scanline 0 immediately after the LCD is enabled.
    *   Derived the exact Mode 0 (88 T), Mode 3 (172 T), and H-Blank phase lengths, explaining why scanline 0 on startup has a duration of **458 T-cycles** (late by 2 T-cycles/dots relative to the standard 456 T-cycles) and why Mode 2 is skipped on the first line.
4.  **Generated Comprehensive Documentation**:
    *   Saved to the repository: [gpu_timing_analysis.md](file:///Users/tomas.vojtasek/fun/feather-gb/analysis/gpu_timing_analysis.md).

## Verification Results

*   All timing timelines were verified relative to the CPU opcode execution cycles (e.g. `wait_ly` loop timing).
*   The documented timelines account for instruction fetch and memory write cycle offsets (e.g., `ldh` write completed in the 3rd M-cycle).
*   The results are mathematically consistent across multiple tests (e.g. VBlank durations, transition alignments).
