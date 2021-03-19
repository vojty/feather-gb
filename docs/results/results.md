## Blargg's tests

https://github.com/retrio/gb-test-roms

Some of those tests are skipped, see `blarggs_tests.rs` why.

| Test                                                             | Result |
| ---------------------------------------------------------------- | ------ |
| roms/gb-test-roms/cpu_instrs/cpu_instrs.gb                       | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/01-special.gb            | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/02-interrupts.gb         | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/03-op sp,hl.gb           | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/04-op r,imm.gb           | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/05-op rp.gb              | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/06-ld r,r.gb             | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/07-jr,jp,call,ret,rst.gb | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/08-misc instrs.gb        | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/09-op r,r.gb             | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/10-bit ops.gb            | ✅     |
| roms/gb-test-roms/cpu_instrs/individual/11-op a,(hl).gb          | ✅     |
| roms/gb-test-roms/instr_timing/instr_timing.gb                   | ✅     |
| roms/gb-test-roms/mem_timing/individual/01-read_timing.gb        | ✅     |
| roms/gb-test-roms/mem_timing/individual/02-write_timing.gb       | ✅     |
| roms/gb-test-roms/mem_timing/individual/03-modify_timing.gb      | ✅     |
| roms/gb-test-roms/mem_timing/mem_timing.gb                       | ✅     |

## Mooneye's tests

https://github.com/Gekkio/mooneye-gb

Only DMG compatible tests used.

| Test                                                                      | Result |
| ------------------------------------------------------------------------- | ------ |
| roms/mooneye-gb/tests/build/acceptance/add_sp_e_timing.gb                 | ✅     |
| roms/mooneye-gb/tests/build/acceptance/bits/mem_oam.gb                    | ✅     |
| roms/mooneye-gb/tests/build/acceptance/bits/reg_f.gb                      | ✅     |
| roms/mooneye-gb/tests/build/acceptance/bits/unused_hwio-GS.gb             | ❌     |
| roms/mooneye-gb/tests/build/acceptance/boot_div-dmg0.gb                   | ✅     |
| roms/mooneye-gb/tests/build/acceptance/boot_hwio-dmg0.gb                  | ❌     |
| roms/mooneye-gb/tests/build/acceptance/boot_regs-dmg0.gb                  | ✅     |
| roms/mooneye-gb/tests/build/acceptance/call_cc_timing.gb                  | ✅     |
| roms/mooneye-gb/tests/build/acceptance/call_cc_timing2.gb                 | ✅     |
| roms/mooneye-gb/tests/build/acceptance/call_timing.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/call_timing2.gb                    | ✅     |
| roms/mooneye-gb/tests/build/acceptance/di_timing-GS.gb                    | ✅     |
| roms/mooneye-gb/tests/build/acceptance/div_timing.gb                      | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ei_sequence.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ei_timing.gb                       | ✅     |
| roms/mooneye-gb/tests/build/acceptance/halt_ime0_ei.gb                    | ✅     |
| roms/mooneye-gb/tests/build/acceptance/halt_ime0_nointr_timing.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/halt_ime1_timing.gb                | ✅     |
| roms/mooneye-gb/tests/build/acceptance/halt_ime1_timing2-GS.gb            | ✅     |
| roms/mooneye-gb/tests/build/acceptance/if_ie_registers.gb                 | ✅     |
| roms/mooneye-gb/tests/build/acceptance/instr/daa.gb                       | ✅     |
| roms/mooneye-gb/tests/build/acceptance/interrupts/ie_push.gb              | ✅     |
| roms/mooneye-gb/tests/build/acceptance/intr_timing.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/jp_cc_timing.gb                    | ✅     |
| roms/mooneye-gb/tests/build/acceptance/jp_timing.gb                       | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ld_hl_sp_e_timing.gb               | ✅     |
| roms/mooneye-gb/tests/build/acceptance/oam_dma/basic.gb                   | ✅     |
| roms/mooneye-gb/tests/build/acceptance/oam_dma/reg_read.gb                | ✅     |
| roms/mooneye-gb/tests/build/acceptance/oam_dma/sources-GS.gb              | ✅     |
| roms/mooneye-gb/tests/build/acceptance/oam_dma_restart.gb                 | ✅     |
| roms/mooneye-gb/tests/build/acceptance/oam_dma_start.gb                   | ✅     |
| roms/mooneye-gb/tests/build/acceptance/oam_dma_timing.gb                  | ✅     |
| roms/mooneye-gb/tests/build/acceptance/pop_timing.gb                      | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/hblank_ly_scx_timing-GS.gb     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/intr_1_2_timing-GS.gb          | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/intr_2_0_timing.gb             | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/intr_2_mode0_timing.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/intr_2_mode0_timing_sprites.gb | ❌     |
| roms/mooneye-gb/tests/build/acceptance/ppu/intr_2_mode3_timing.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/intr_2_oam_ok_timing.gb        | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/lcdon_timing-GS.gb             | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/lcdon_write_timing-GS.gb       | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/stat_irq_blocking.gb           | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/stat_lyc_onoff.gb              | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ppu/vblank_stat_intr-GS.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/push_timing.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/rapid_di_ei.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ret_cc_timing.gb                   | ✅     |
| roms/mooneye-gb/tests/build/acceptance/ret_timing.gb                      | ✅     |
| roms/mooneye-gb/tests/build/acceptance/reti_intr_timing.gb                | ✅     |
| roms/mooneye-gb/tests/build/acceptance/reti_timing.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/rst_timing.gb                      | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/div_write.gb                 | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/rapid_toggle.gb              | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim00.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim00_div_trigger.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim01.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim01_div_trigger.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim10.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim10_div_trigger.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim11.gb                     | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tim11_div_trigger.gb         | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tima_reload.gb               | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tima_write_reloading.gb      | ✅     |
| roms/mooneye-gb/tests/build/acceptance/timer/tma_write_reloading.gb       | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/bits_bank1.gb              | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/bits_bank2.gb              | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/bits_mode.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/bits_ramg.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/multicart_rom_8Mb.gb       | ❌     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/ram_256kb.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/ram_64kb.gb                | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/rom_16Mb.gb                | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/rom_1Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/rom_2Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/rom_4Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/rom_512kb.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc1/rom_8Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/bits_ramg.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/bits_romb.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/bits_unused.gb             | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/ram.gb                     | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/rom_1Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/rom_2Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc2/rom_512kb.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_16Mb.gb                | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_1Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_2Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_32Mb.gb                | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_4Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_512kb.gb               | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_64Mb.gb                | ✅     |
| roms/mooneye-gb/tests/build/emulator-only/mbc5/rom_8Mb.gb                 | ✅     |
| roms/mooneye-gb/tests/build/madness/mgb_oam_dma_halt_sprites.gb           | ❌     |
| roms/mooneye-gb/tests/build/manual-only/sprite_priority.gb                | ❌     |
| roms/mooneye-gb/tests/build/utils/bootrom_dumper.gb                       | ❌     |
| roms/mooneye-gb/tests/build/utils/dump_boot_hwio.gb                       | ✅     |

## Scribbltests

https://github.com/Hacktix/scribbltests

| Name      | Expected                    | Result                    | Diff                    | Status     |
| --------- | --------------------------- | ------------------------- | ----------------------- | ---------- |
| scxly     | ![](scxly/expected.png)     | ![](scxly/result.png)     | ![](scxly/diff.png)     | ✅ Diff: 0 |
| lycscx    | ![](lycscx/expected.png)    | ![](lycscx/result.png)    | ![](lycscx/diff.png)    | ✅ Diff: 0 |
| lycscy    | ![](lycscy/expected.png)    | ![](lycscy/result.png)    | ![](lycscy/diff.png)    | ✅ Diff: 0 |
| palettely | ![](palettely/expected.png) | ![](palettely/result.png) | ![](palettely/diff.png) | ✅ Diff: 0 |

## TurtleTests

https://github.com/Powerlated/TurtleTests/

| Name                          | Expected                                        | Result                                        | Diff                                        | Status     |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------- | ---------- |
| window_y_trigger              | ![](window_y_trigger/expected.png)              | ![](window_y_trigger/result.png)              | ![](window_y_trigger/diff.png)              | ✅ Diff: 0 |
| window_y_trigger_wx_offscreen | ![](window_y_trigger_wx_offscreen/expected.png) | ![](window_y_trigger_wx_offscreen/result.png) | ![](window_y_trigger_wx_offscreen/diff.png) | ✅ Diff: 0 |

## MBC3-Tester

https://github.com/EricKirschenmann/MBC3-Tester-gb

| Name        | Expected                      | Result                      | Diff                      | Status     |
| ----------- | ----------------------------- | --------------------------- | ------------------------- | ---------- |
| MBC3-Tester | ![](MBC3-Tester/expected.png) | ![](MBC3-Tester/result.png) | ![](MBC3-Tester/diff.png) | ✅ Diff: 0 |

Generated at: 2021-03-19 16:39:03.614621 UTC
