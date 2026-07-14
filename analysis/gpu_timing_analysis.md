# Game Boy DMG PPU Event Timing Documentation

This documentation describes the cycle-accurate timing expectations of the original Game Boy (DMG, MGB, SGB, SGB2) Pixel Processing Unit (PPU). These findings are derived from analyzing Joonas Javanainen's (**mooneye-gb**) GPU/PPU acceptance test suite in the repository.

This reference is designed to assist emulator developers in implementing highly accurate PPU timing for DMG mode.

---

## 1. Timing Foundations & Conventions

### Clock Cycle Definitions
*   **M-cycle (Machine cycle):** The base clock cycle of the SM83 CPU. 1 M-cycle = 4 T-cycles.
*   **T-cycle (Tick cycle):** The base system clock (4.194304 MHz on DMG).
*   **Scanline Duration:** A standard scanline consists of **456 T-cycles** (114 M-cycles).
*   **Frame Duration:** A full frame consists of 154 scanlines (scanlines 0-153), totaling **70,224 T-cycles** (17,556 M-cycles).

---

## 2. LCD ON Startup Timing (Verified by `lcdon_timing-GS.s`)

When the LCD is enabled by writing `1` to `LCDC` bit 7, the PPU does not begin drawing scanline 0 with a normal Mode 2 (OAM Search). Instead, it runs a special startup sequence.

The exact cycles of this startup sequence are verified by [lcdon_timing-GS.s](file:///Users/tomas.vojtasek/fun/feather-gb/roms/mooneye-test-suite/acceptance/ppu/lcdon_timing-GS.s).

### Scanline 0 Startup Timeline
Let `t = 0` be the T-cycle immediately after the write that re-enables the LCD (completing the `ldh (<LCDC), a` write cycle).

1.  **Mode 0 (H-Blank) Phase:** `t = 0` to `t = 88` T-cycles.
    *   The PPU starts in **Mode 0** instead of Mode 2.
    *   During this phase, OAM and VRAM are fully accessible to the CPU.
    *   At `t = 84` T-cycles (Pass 1 offset 17 read), `STAT` reads Mode `0` and OAM is accessible (`$00`).
2.  **Mode 3 (Pixel Transfer) Phase:** `t = 88` to `t = 260` T-cycles.
    *   At `t = 88` T-cycles (Pass 2 offset 18 read), `STAT` mode transitions to `3` and OAM/VRAM become blocked (`$FF`).
    *   This phase lasts exactly **172 T-cycles** (the minimum Mode 3 length).
3.  **Mode 0 (H-Blank) Phase:** `t = 260` to `t = 462` T-cycles.
    *   At `t = 260` T-cycles (Pass 2 offset 61 read), `STAT` mode transitions back to `0` and OAM/VRAM are re-enabled.
    *   **The Early LY Increment Quirk:** At exactly `t = 458` T-cycles, **`LY` increments 0 $\rightarrow$ 1**.
        *   Between `t = 458` and `t = 462` T-cycles (1 M-cycle), `LY` reads as `1` but the `STAT` mode remains `0`.
    *   So the total duration of scanline 0 is **458 T-cycles** (late by 2 T-cycles relative to the standard 456 T-cycles).
4.  **Scanline 1 Mode 2 Entry:** At `t = 462` T-cycles, the PPU transitions to **Mode 2 (OAM Search)** of scanline 1.

### Scanline 1 Timing (Normal Timing)
1.  **Mode 2 (OAM Search):** `t = 462` to `t = 542` T-cycles (lasts exactly **80 T-cycles**).
    *   At `t = 540` T-cycles (Pass 2 offset 131 read), `STAT` mode is still `2`.
    *   At `t = 544` T-cycles (Pass 3 offset 132 read), `STAT` mode transitions to `3`.
2.  **Mode 3 (Pixel Transfer):** `t = 542` to `t = 714` T-cycles (lasts exactly **172 T-cycles**).
3.  **Mode 0 (H-Blank):** `t = 714` to `t = 918` T-cycles.
    *   **The Early LY Increment Quirk:** At exactly `t = 914` T-cycles, **`LY` increments 1 $\rightarrow$ 2**.
    *   At `t = 918` T-cycles, Mode transitions to **Mode 2** of scanline 2.
    *   The total duration of scanline 1 (`LY = 1`) is exactly **456 T-cycles** (`914 - 458 = 456` T-cycles).

---

## 3. The Early LY Increment Quirk (1 M-cycle Offset)

On DMG, the `LY` register increments from line `N` to `N+1` **4 T-cycles (1 M-cycle) before** the PPU mode transitions to Mode 2 (OAM Search).
During this 1 M-cycle window:
*   `LY` reads as `N+1`.
*   The `STAT` register mode bits read as `0` (H-Blank of previous line `N`).
*   The `LY = LYC` comparison uses the updated `LY` value (`N+1`), but the Coincidence flag in `STAT` is not yet set (latching is delayed by 1 M-cycle), and the STAT interrupt is not yet triggered.

### Cycle Timeline for `ly_lyc-GS.s` (LYC = 2)
Timeline starting from LCD ON at `t = 0` (adjusted for the `res`/`set` instruction sequence in the test):

| Time (`t` in T-cycles) | PPU Event / Register Values |
| :--- | :--- |
| `t = 0` | LCD turned on. `LY = 0`. Scanline 0 begins. |
| `t = 448` | **`LY` increments 0 $\rightarrow$ 1.** (Scanline 0 ends early due to `res`/`set` fast-cycle differences). |
| `t = 452` | Mode transitions to **Mode 2 (OAM Search)**. |
| `t = 904` | **`LY` increments 1 $\rightarrow$ 2.** `STAT` reads as `$C0` (Coincidence = 0, Mode = 0). |
| `t = 908` | **Coincidence flag sets to 1** AND Mode transitions to **Mode 2**. `STAT` reads as `$C6`. STAT interrupt triggers (`IF` bit 1 sets). |
| `t = 1360` | **`LY` increments 2 $\rightarrow$ 3.** **Coincidence flag clears to 0 immediately.** `STAT` reads as `$C0` (Coincidence = 0, Mode = 0). |
| `t = 1364` | Mode transitions to **Mode 2**. `STAT` reads as `$C2`. |

*Takeaway:* Setting the Coincidence flag and triggering the STAT interrupt are delayed by **4 T-cycles (1 M-cycle)** after `LY` increments. Clearing the Coincidence flag is **immediate** when `LY` increments.

---

## 4. Transitions at V-Blank Entry (Scanline 143 $\rightarrow$ 144)

The transition from active scanlines to V-Blank follows the same 1 M-cycle offset rules.
Using the exit of `wait_ly 143` as a baseline (`T_exit`):

*   **Mode 3 $\rightarrow$ Mode 0 (H-Blank) on line 143:** Occurs at `T_exit + 204` T-cycles (Mode reads as `0`).
*   **LY Increment (143 $\rightarrow$ 144):** Occurs at `T_exit + 404` T-cycles. `LY` is read as `144`, but `STAT` mode is still `0`.
*   **V-Blank Entry (Mode 1):** Occurs at `T_exit + 408` T-cycles (4 T-cycles later). `STAT` mode transitions to `1` (V-Blank). Both the V-Blank interrupt (`IF` bit 0) and the STAT interrupt (`IF` bit 1, if `LYC = 144`) are requested at this cycle.
*   **Scanline 144 $\rightarrow$ 145:** `LY` increments to `145` at `T_exit + 860` T-cycles (`456` T-cycles after V-Blank entry).

All intermediate V-Blank lines (144 $\rightarrow$ 152) last exactly **456 T-cycles** (verified by `ly143_144_152_153.s` at 1127 nops).

---

## 5. The Scanline 153 Quirk (Frame End & Scanline 0)

At the end of V-Blank, scanline 153 behaves exceptionally (verified by `ly_new_frame-GS.s`).
Using the exit of `wait_ly 152` as a baseline (`T_exit`):

1.  **LY Increment (152 $\rightarrow$ 153):** Occurs at `T_exit + 412` T-cycles.
2.  **Scanline 153 Duration:** Scanline 153 lasts for exactly **4 T-cycles (1 M-cycle)**.
3.  **LY Increment (153 $\rightarrow$ 0):** Occurs at `T_exit + 416` T-cycles (just 4 T-cycles after becoming 153).
4.  **Scanline 0 V-Blank Mode Extended:** When `LY` becomes `0`, the PPU remains in **Mode 1 (V-Blank)** for another **452 T-cycles** (`T_exit + 416` to `T_exit + 868`).
5.  **Scanline 0 H-Blank Transition:** At `T_exit + 868` T-cycles, the PPU transitions to **Mode 0 (H-Blank)** for exactly **4 T-cycles (1 M-cycle)**.
6.  **Scanline 0 OAM Search Transition:** At `T_exit + 872` T-cycles, the PPU transitions to **Mode 2 (OAM Search)**, beginning active rendering for the new frame.
7.  **Scanline 0 $\rightarrow$ Scanline 1:** `LY` increments to `1` at `T_exit + 1324` T-cycles (scanline 0 total duration: 908 T-cycles). Mode transitions to Mode 2 at `T_exit + 1328`.

### Coincidence Timing on Scanline 0
*   If `LYC = 0`, the coincidence flag is updated to `1` and the STAT interrupt is requested at `T_exit + 424` T-cycles (exactly 8 T-cycles / 2 M-cycles after `LY` becomes 0).
*   If `LYC = 0`, the coincidence flag is cleared to `0` at `T_exit + 1324` T-cycles (immediately when `LY` increments to 1).

---

## 6. LYC Register Write Behavior

Writing to `LYC` updates the value in the register and triggers an immediate comparison against the active `LY` value.

*   **Interrupt Trigger Window:** When `LY` increments to a value matching `LYC`, the comparison succeeds, and the interrupt triggers 4 T-cycles later. If software overwrites `LYC` during this 4 T-cycle window, the coincidence match is aborted, and the interrupt does not fire.
*   **Scanline 0 Write Lockout:** On scanline 0, when transitioning from `LY = 0` to `LY = 1` (around `T_exit + 1324` T-cycles), writing `0` to `LYC` at or after `T_exit + 1300` T-cycles (write completed by `T_exit + 1312`) will not trigger a coincidence interrupt, as the comparison window for line 0 has closed.
