# DMG timing notes

Observed DMG behaviour modelled by feather-gb.

References: [SameBoy](https://github.com/LIJI32/SameBoy) (`Core/sm83_cpu.c`, `Core/display.c`), [docboy](https://github.com/Docheinstein/docboy) (`ppu/ppu.cpp`, `interrupts/interrupts.h`, `timers/timers.cpp`).

T0–T3 are the T-cycles of an M-cycle. A line dot is counted from the LY change (dot 0). Only relative timing can be compared across emulators, because each one puts the CPU/PPU phase origin somewhere else.

## CPU access

Hardware ticks first, and reads/writes happen at the end of the M-cycle.

## Register writes

Plain writes land at the end of the M-cycle. These registers differ:

| Register | Behaviour | Tests | References |
|---|---|---|---|
| BGP, OBP0/1 | PPU sees `old \| new` for one dot (T2), then `new` | Mealybug `m3_bgp_change` | SameBoy, docboy (BGP only) |
| STAT | Behaves as `0xFF` for one T-cycle, then the real value applies (STAT write bug) | Wilbertpol `stat_write_if-GS` | SameBoy, docboy |
| LCDC | Written at T2. LCD on/off takes effect immediately | LCD-on timing tests | docboy (SameBoy writes BG_EN at T2, rest at T3) |
| IF | Write wins: interrupt requests are blocked until the end of the first dot of the next M-cycle | none | docboy (SameBoy: written 1 T-cycle later) |
| SCX | Written at T2 | none | SameBoy |
| SCY | Written at T3 | none | SameBoy |

## Interrupts and HALT

- Interrupts are checked at the end of the opcode fetch. If one is pending, the fetched opcode is discarded and dispatch takes 4 more M-cycles: 2 internal, push PC high, push PC low.
- The vector is picked after the high byte is pushed, so a push over IE can cancel the dispatch (Mooneye `ie_push`).
- While halted, interrupts are sampled 2 dots into each M-cycle. Each halted M-cycle behaves like a NOP fetch.
- Waking with IME=0 executes the next opcode without an extra M-cycle.

## Timer

After TIMA overflows it reads `0x00` for 4 T-cycles. Then TMA is loaded and the interrupt is requested at the same time (Wilbertpol `timer_if`). References: SameBoy, docboy.

## PPU

**Screen lines (0–143)**, 456 dots:

| Dot | Event |
|---|---|
| 0 | LY changes. STAT reads mode 0. LY=LYC flag cleared. Mode 2 STAT interrupt fires (1 dot before STAT shows mode 2; not on line 0) |
| 1 | STAT mode 2. LY=LYC compared |
| 77 | VRAM reads blocked |
| 81 | STAT mode 3 |
| mode 3 end | STAT mode 0. Mode 0 interrupt fires 1 dot later |

**First line after LCD on:**
- STAT stays in mode 0 during OAM scan, and there is no mode 2 interrupt.
- The LCD turns on 1 T-cycle before the end of the LCDC-writing M-cycle, which corresponds to line dot 2.
- Mode 3 starts at dot 81, as on normal lines.
- The line is 2 dots shorter.

**V-Blank lines (144–153):**
- LY changes 1 dot earlier than on screen lines: line 143 is 455 dots, line 153 is 457.
- LY=LYC comparison is off from 2 dots before the LY change until dot 2.
- Line 144:
  - Dot 0: STAT interrupt fires if bit 5 (OAM) is enabled.
  - Dot 3: mode 1 and the V-Blank interrupt. Bit 5 also triggers a STAT interrupt here.
- Line 153:
  - Dot 0: LY reads 153.
  - Dot 4: LY reads 0 and LY=LYC is compared against 153.
  - Dots 6–9: comparison off.
  - From dot 10: compared against 0.

## Calibrated, not derived

- Pixel pipeline start (dot 78): depends on our fetcher, which is built differently from other emulators.
- DIV (`0xABCB`) and the PPU position when the boot ROM is skipped.

## Not modelled

- LCDC `OBJ_EN` write special cases and the window-disable glitch.
- WX 1-dot "just changed" glitch.
- Sprite penalty during mode 3.
- Most mid-scanline register changes (Mealybug `m3_*`).
