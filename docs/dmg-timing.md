# DMG timing notes

Observed DMG behaviour modelled by feather-gb.

References: [SameBoy](https://github.com/LIJI32/SameBoy) (`Core/sm83_cpu.c`, `Core/display.c`), [docboy](https://github.com/Docheinstein/docboy) (`ppu/ppu.cpp`, `interrupts/interrupts.h`, `timers/timers.cpp`).

T0–T3 are the T-cycles of an M-cycle. A line dot is counted from the LY change (dot 0). Only relative timing can be compared across emulators, because each one puts the CPU/PPU phase origin somewhere else.

## CPU access

Hardware ticks first, and reads/writes happen at the end of the M-cycle.

## Register writes

Plain writes land at the end of the M-cycle. These registers differ:

| Register    | Behaviour                                                                                         | Tests                                                          | References                                                                |
| ----------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| BGP, OBP0/1 | PPU sees `old \| new` for one dot (T2), then `new`                                                | Mealybug `m3_bgp_change`                                       | SameBoy, docboy (BGP only)                                                |
| STAT        | Behaves as `0xFF` for one T-cycle, then the real value applies (STAT write bug)                   | Wilbertpol `stat_write_if-GS`                                  | SameBoy, docboy                                                           |
| LCDC        | Written at T2. LCD on/off takes effect immediately. The window logic sees WIN_EN 1 dot later (T3) | LCD-on timing tests, Mealybug `m3_lcdc_win_en_change_multiple` | docboy (SameBoy writes BG_EN at T2, rest at T3)                           |
| IF          | Write wins: interrupt requests are blocked until the end of the first dot of the next M-cycle     | none                                                           | docboy (SameBoy: written 1 T-cycle later)                                 |
| SCX         | Written at T2                                                                                     | none                                                           | SameBoy                                                                   |
| SCY         | Written at T3                                                                                     | none                                                           | SameBoy                                                                   |
| WX          | Plain write. The PPU ticks before the write lands, so it sees the new value from the next dot     | Mealybug `m3_wx_*_change`                                      | docboy's 1-dot `last_wx` delay gives the same result for its write timing |

## Interrupts and HALT

- Interrupts are checked at the end of the opcode fetch. If one is pending, the fetched opcode is discarded and dispatch takes 4 more M-cycles: 2 internal, push PC high, push PC low.
- The vector is picked after the high byte is pushed, so a push over IE can cancel the dispatch (Mooneye `ie_push`).
- While halted, interrupts are sampled 2 dots into each M-cycle. Each halted M-cycle behaves like a NOP fetch.
- Waking with IME=0 executes the next opcode without an extra M-cycle.

## Timer

After TIMA overflows it reads `0x00` for 4 T-cycles. Then TMA is loaded and the interrupt is requested at the same time (Wilbertpol `timer_if`). References: SameBoy, docboy.

## PPU

**Screen lines (0–143)**, 456 dots:

| Dot        | Event                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 0          | LY changes. STAT reads mode 0. LY=LYC flag cleared. Mode 2 STAT interrupt fires (1 dot before STAT shows mode 2; not on line 0) |
| 1          | STAT mode 2. LY=LYC compared                                                                                                    |
| 77         | VRAM reads blocked                                                                                                              |
| 81         | STAT mode 3                                                                                                                     |
| mode 3 end | STAT mode 0. Mode 0 interrupt fires 1 dot later                                                                                 |

**First line after LCD on:**

- STAT stays in mode 0 during OAM scan, and there is no mode 2 interrupt.
- The LCD turns on 1 T-cycle before the end of the LCDC-writing M-cycle, which corresponds to line dot 2.
- Mode 3 starts at dot 81, as on normal lines.
- The line is 2 dots shorter.

**V-Blank lines (144–153):**

- Every line is 456 dots, and LY changes at dot 0 as on screen lines (same as DocBoy).
- LY=LYC comparison is off from dot 453 of the previous line until dot 1 (lines 143–152 → 144–153).
- Line 143, dot 455: PPU internally enters V-Blank. STAT interrupt fires if bit 5 (OAM) is enabled.
- Line 144, dot 2: mode 1 and the V-Blank interrupt. Bit 5 also triggers a STAT interrupt here.
- Line 153:
  - Dot 0: LY reads 153.
  - Dot 3: LY reads 0 and LY=LYC is compared against 153.
  - Dots 5–8: comparison off.
  - From dot 9: compared against 0.

**Pixel transfer** (dots without sprites, SCX % 8 = 0):

| Dot   | Event                                                                              |
| ----- | ---------------------------------------------------------------------------------- |
| 78    | Pipeline starts                                                                    |
| 80–85 | Junk tile fetch                                                                    |
| 86    | Junk tile pushed to the BG FIFO                                                    |
| 86–93 | LX 0–7: the junk pixels are shifted out but not drawn. Tile 0 is fetched meanwhile |
| 94    | Tile 0 pushed, LX 8 is the first visible pixel (x = LX − 8)                        |

- SCX discard: before LX starts counting, SCX % 8 pixels are discarded. SCX is compared live on every dot until it matches the discarded count (SameBoy; docboy reads SCX once instead). Mealybug `m3_window_timing_wx_0`.
- The BG tile counter advances when a tile's high byte is fetched. The junk tile doesn't advance it.
- Each fetcher step takes 2 dots: LCDC and SCX are latched on the first one, VRAM (and SCY) is read on the second one. The push dot is also the first dot of the next tile ID fetch.
- Objects: when LX matches an object's X, the pipeline waits until the BG fetcher has read the tile's high byte and the BG FIFO isn't empty, then stalls for 6 more dots (the BG fetcher advances during the first 2). On DMG, clearing OBJ_EN while waiting skips the object. If the window triggers at the same LX, the trigger goes first and the object waits for the first window tile (Mealybug `m3_lcdc_tile_sel_win_change`). Only the timing is modelled, object pixels are drawn at the end of mode 3. AGE `stat-mode-sprites`, SameBoy.

## Window

Based on docboy's model, using its LX counter.

- **WY condition:** checked on every dot of the frame. LY = WY while WIN_EN is set marks the window as triggerable for the rest of the frame. Reset when a new frame starts.
- **Trigger:** happens when the pixel about to be shifted out is at LX = WX + 1, so the window starts at x = WX − 7. LCDC.0 doesn't matter (the window is just not drawn). WX < 7 triggers during LX 0–7, and the first 7 − WX window pixels are shifted out undrawn. AGE `stat-mode-window`, Mealybug `m3_window_timing`.
- **Trigger cost:** the BG FIFO is cleared and the window tile arrives 6 dots later.
- **WX = 0, SCX % 8 > 0:** triggers when the junk tile is pushed, before the SCX discard, plus 1 idle dot. The discard then applies to window pixels. This means 1 dot more than other WX values. Mealybug `m3_window_timing_wx_0`, docboy.
- **WX = 166:** doesn't trigger on DMG (CGB: up to 166). AGE `stat-mode-window`.
- **Window enabled late (DMG):** if WIN_EN was off on the previous dot, the window also triggers 1 dot late (LX = WX + 2). Mealybug `m3_lcdc_win_en_change_multiple_wx`, docboy.
- **Window disabled:** if WIN_EN is off when a window tile fetch starts, the fetcher switches back to the BG and the window can trigger again on the same line. The first window tile's fetch starts on the trigger dot, so LCDC (WIN_EN and the window tile map) is latched there (SameBoy). If WIN_EN is cleared on the trigger dot, the BG FIFO is still cleared, but the BG is fetched instead. A tile whose fetch has already started is fetched from the window, even if WIN_EN is cleared during the fetch. Window tiles (except the first one) also advance the BG tile counter, so the BG continues where the window covered it. Mealybug `m3_lcdc_win_en_change_multiple`, `m3_lcdc_win_en_change_multiple_wx`, docboy (it checks WIN_EN on every fetcher step, which breaks the test with our fetcher timing).
- **00 pixel glitch (DMG):** if LX = WX + 1 on the dot a tile is pushed, a color 0 pixel is shifted out instead and the tile waits 1 dot. It applies whenever the WY condition was met in the frame, also to the BG and on later lines, but not to the first tile after a trigger (also when the window was aborted during it). On CGB only while the window is active. Mealybug `m3_wx_4_change`, `m3_wx_5_change`, `m3_wx_6_change`, docboy.

## Calibrated, not derived

- Pixel pipeline start (dot 78) and the fetcher start (dot 80): depend on our fetcher, which is built differently from other emulators.
- The trigger condition LX = WX + 1, measured against our pipeline order (docboy checks LX = WX after shifting the pixel out).
- DIV (`0xABCB`) and the PPU position when the boot ROM is skipped.

## Not modelled

- LCDC `OBJ_EN` write special cases and the CGB window-disable glitches.
- WX 1-dot "just changed" glitch (SameBoy's late trigger at position + 6).
- OBJ FIFO: objects only stall the pipeline, see Pixel transfer.
- Most mid-scanline register changes (Mealybug `m3_*`).
