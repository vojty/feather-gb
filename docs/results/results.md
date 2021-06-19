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

## Blargg's tests - dmg_sound

https://github.com/retrio/gb-test-roms

| Name                     | Expected                                   | Result                                   | Diff                                   | Status        |
| ------------------------ | ------------------------------------------ | ---------------------------------------- | -------------------------------------- | ------------- |
| 01-registers             | ![](01-registers/expected.png)             | ![](01-registers/result.png)             | ![](01-registers/diff.png)             | ✅ Diff: 0    |
| 02-len_ctr               | ![](02-len_ctr/expected.png)               | ![](02-len_ctr/result.png)               | ![](02-len_ctr/diff.png)               | ✅ Diff: 0    |
| 03-trigger               | ![](03-trigger/expected.png)               | ![](03-trigger/result.png)               | ![](03-trigger/diff.png)               | ✅ Diff: 0    |
| 04-sweep                 | ![](04-sweep/expected.png)                 | ![](04-sweep/result.png)                 | ![](04-sweep/diff.png)                 | ✅ Diff: 0    |
| 05-sweep_details         | ![](05-sweep_details/expected.png)         | ![](05-sweep_details/result.png)         | ![](05-sweep_details/diff.png)         | ✅ Diff: 0    |
| 06-overflow_on_trigger   | ![](06-overflow_on_trigger/expected.png)   | ![](06-overflow_on_trigger/result.png)   | ![](06-overflow_on_trigger/diff.png)   | ✅ Diff: 0    |
| 07-len_sweep_period_sync | ![](07-len_sweep_period_sync/expected.png) | ![](07-len_sweep_period_sync/result.png) | ![](07-len_sweep_period_sync/diff.png) | ✅ Diff: 0    |
| 08-len_ctr_during_power  | ![](08-len_ctr_during_power/expected.png)  | ![](08-len_ctr_during_power/result.png)  | ![](08-len_ctr_during_power/diff.png)  | ✅ Diff: 0    |
| 09-wave_read_while_on    | ![](09-wave_read_while_on/expected.png)    | ![](09-wave_read_while_on/result.png)    | ![](09-wave_read_while_on/diff.png)    | ❌ Diff: 3433 |
| 10-wave_trigger_while_on | ![](10-wave_trigger_while_on/expected.png) | ![](10-wave_trigger_while_on/result.png) | ![](10-wave_trigger_while_on/diff.png) | ❌ Diff: 290  |
| 11-regs_after_power      | ![](11-regs_after_power/expected.png)      | ![](11-regs_after_power/result.png)      | ![](11-regs_after_power/diff.png)      | ✅ Diff: 0    |
| 12-wave_write_while_on   | ![](12-wave_write_while_on/expected.png)   | ![](12-wave_write_while_on/result.png)   | ![](12-wave_write_while_on/diff.png)   | ❌ Diff: 549  |

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

## Wilbertpol's tests

From https://github.com/Amjad50/mooneye-gb

| Test                                                               | Result |
| ------------------------------------------------------------------ | ------ |
| roms/wilbertpol-tests/gpu/hblank_ly_scx_timing-GS.gb               | ✅     |
| roms/wilbertpol-tests/gpu/hblank_ly_scx_timing_nops.gb             | ❌     |
| roms/wilbertpol-tests/gpu/hblank_ly_scx_timing_variant_nops.gb     | ❌     |
| roms/wilbertpol-tests/gpu/intr_0_timing.gb                         | ✅     |
| roms/wilbertpol-tests/gpu/intr_1_2_timing-GS.gb                    | ✅     |
| roms/wilbertpol-tests/gpu/intr_1_timing.gb                         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_0_timing.gb                       | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx1_timing_nops.gb         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx2_timing_nops.gb         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx3_timing_nops.gb         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx4_timing_nops.gb         | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx5_timing_nops.gb         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx6_timing_nops.gb         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx7_timing_nops.gb         | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_scx8_timing_nops.gb         | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing.gb                   | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing_sprites.gb           | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_nops.gb      | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx1_nops.gb | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx2_nops.gb | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx3_nops.gb | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode0_timing_sprites_scx4_nops.gb | ❌     |
| roms/wilbertpol-tests/gpu/intr_2_mode3_timing.gb                   | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_oam_ok_timing.gb                  | ✅     |
| roms/wilbertpol-tests/gpu/intr_2_timing.gb                         | ❌     |
| roms/wilbertpol-tests/gpu/lcdon_mode_timing.gb                     | ✅     |
| roms/wilbertpol-tests/gpu/ly00_01_mode0_2.gb                       | ✅     |
| roms/wilbertpol-tests/gpu/ly00_mode0_2-GS.gb                       | ✅     |
| roms/wilbertpol-tests/gpu/ly00_mode1_0-GS.gb                       | ✅     |
| roms/wilbertpol-tests/gpu/ly00_mode2_3.gb                          | ✅     |
| roms/wilbertpol-tests/gpu/ly00_mode3_0.gb                          | ✅     |
| roms/wilbertpol-tests/gpu/ly143_144_145.gb                         | ✅     |
| roms/wilbertpol-tests/gpu/ly143_144_152_153.gb                     | ✅     |
| roms/wilbertpol-tests/gpu/ly143_144_mode0_1.gb                     | ✅     |
| roms/wilbertpol-tests/gpu/ly143_144_mode3_0.gb                     | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc-GS.gb                             | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc_0-GS.gb                           | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc_0_write-GS.gb                     | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc_144-GS.gb                         | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc_153-GS.gb                         | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc_153_write-GS.gb                   | ✅     |
| roms/wilbertpol-tests/gpu/ly_lyc_write-GS.gb                       | ✅     |
| roms/wilbertpol-tests/gpu/ly_new_frame-GS.gb                       | ✅     |
| roms/wilbertpol-tests/gpu/stat_irq_blocking.gb                     | ✅     |
| roms/wilbertpol-tests/gpu/stat_write_if-GS.gb                      | ❌     |
| roms/wilbertpol-tests/gpu/vblank_if_timing.gb                      | ✅     |
| roms/wilbertpol-tests/gpu/vblank_stat_intr-GS.gb                   | ✅     |

## acid2 tests

- https://github.com/mattcurrie/dmg-acid2
- https://github.com/mattcurrie/cgb-acid2

| Name      | Expected                    | Result                    | Diff                    | Status     |
| --------- | --------------------------- | ------------------------- | ----------------------- | ---------- |
| dmg-acid2 | ![](dmg-acid2/expected.png) | ![](dmg-acid2/result.png) | ![](dmg-acid2/diff.png) | ✅ Diff: 0 |
| cgb-acid2 | ![](cgb-acid2/expected.png) | ![](cgb-acid2/result.png) | ![](cgb-acid2/diff.png) | ✅ Diff: 0 |

## Scribbltests

https://github.com/Hacktix/scribbltests

| Name      | Expected                    | Result                    | Diff                    | Status     |
| --------- | --------------------------- | ------------------------- | ----------------------- | ---------- |
| scxly     | ![](scxly/expected.png)     | ![](scxly/result.png)     | ![](scxly/diff.png)     | ✅ Diff: 0 |
| lycscx    | ![](lycscx/expected.png)    | ![](lycscx/result.png)    | ![](lycscx/diff.png)    | ✅ Diff: 0 |
| lycscy    | ![](lycscy/expected.png)    | ![](lycscy/result.png)    | ![](lycscy/diff.png)    | ✅ Diff: 0 |
| palettely | ![](palettely/expected.png) | ![](palettely/result.png) | ![](palettely/diff.png) | ✅ Diff: 0 |
| statcount | ![](statcount/expected.png) | ![](statcount/result.png) | ![](statcount/diff.png) | ✅ Diff: 0 |

## TurtleTests

https://github.com/Powerlated/TurtleTests

| Name                          | Expected                                        | Result                                        | Diff                                        | Status     |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------- | ---------- |
| window_y_trigger              | ![](window_y_trigger/expected.png)              | ![](window_y_trigger/result.png)              | ![](window_y_trigger/diff.png)              | ✅ Diff: 0 |
| window_y_trigger_wx_offscreen | ![](window_y_trigger_wx_offscreen/expected.png) | ![](window_y_trigger_wx_offscreen/result.png) | ![](window_y_trigger_wx_offscreen/diff.png) | ✅ Diff: 0 |

## MBC3-Tester

https://github.com/EricKirschenmann/MBC3-Tester-gb

| Name        | Expected                      | Result                      | Diff                      | Status     |
| ----------- | ----------------------------- | --------------------------- | ------------------------- | ---------- |
| MBC3-Tester | ![](MBC3-Tester/expected.png) | ![](MBC3-Tester/result.png) | ![](MBC3-Tester/diff.png) | ✅ Diff: 0 |

## Mealybug Tearoom Tests

https://github.com/mattcurrie/mealybug-tearoom-tests

| Name                              | Expected                                            | Result                                            | Diff                                            | Status         |
| --------------------------------- | --------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- | -------------- |
| m2_win_en_toggle                  | ![](m2_win_en_toggle/expected.png)                  | ![](m2_win_en_toggle/result.png)                  | ![](m2_win_en_toggle/diff.png)                  | ✅ Diff: 0     |
| m3_bgp_change                     | ![](m3_bgp_change/expected.png)                     | ![](m3_bgp_change/result.png)                     | ![](m3_bgp_change/diff.png)                     | ❌ Diff: 2927  |
| m3_bgp_change_sprites             | ![](m3_bgp_change_sprites/expected.png)             | ![](m3_bgp_change_sprites/result.png)             | ![](m3_bgp_change_sprites/diff.png)             | ❌ Diff: 9346  |
| m3_lcdc_bg_en_change              | ![](m3_lcdc_bg_en_change/expected.png)              | ![](m3_lcdc_bg_en_change/result.png)              | ![](m3_lcdc_bg_en_change/diff.png)              | ❌ Diff: 3457  |
| m3_lcdc_bg_map_change             | ![](m3_lcdc_bg_map_change/expected.png)             | ![](m3_lcdc_bg_map_change/result.png)             | ![](m3_lcdc_bg_map_change/diff.png)             | ❌ Diff: 2386  |
| m3_lcdc_obj_en_change             | ![](m3_lcdc_obj_en_change/expected.png)             | ![](m3_lcdc_obj_en_change/result.png)             | ![](m3_lcdc_obj_en_change/diff.png)             | ❌ Diff: 146   |
| m3_lcdc_obj_en_change_variant     | ![](m3_lcdc_obj_en_change_variant/expected.png)     | ![](m3_lcdc_obj_en_change_variant/result.png)     | ![](m3_lcdc_obj_en_change_variant/diff.png)     | ❌ Diff: 1334  |
| m3_lcdc_obj_size_change           | ![](m3_lcdc_obj_size_change/expected.png)           | ![](m3_lcdc_obj_size_change/result.png)           | ![](m3_lcdc_obj_size_change/diff.png)           | ❌ Diff: 309   |
| m3_lcdc_obj_size_change_scx       | ![](m3_lcdc_obj_size_change_scx/expected.png)       | ![](m3_lcdc_obj_size_change_scx/result.png)       | ![](m3_lcdc_obj_size_change_scx/diff.png)       | ❌ Diff: 190   |
| m3_lcdc_tile_sel_change           | ![](m3_lcdc_tile_sel_change/expected.png)           | ![](m3_lcdc_tile_sel_change/result.png)           | ![](m3_lcdc_tile_sel_change/diff.png)           | ❌ Diff: 2574  |
| m3_lcdc_tile_sel_win_change       | ![](m3_lcdc_tile_sel_win_change/expected.png)       | ![](m3_lcdc_tile_sel_win_change/result.png)       | ![](m3_lcdc_tile_sel_win_change/diff.png)       | ❌ Diff: 2741  |
| m3_lcdc_win_en_change_multiple    | ![](m3_lcdc_win_en_change_multiple/expected.png)    | ![](m3_lcdc_win_en_change_multiple/result.png)    | ![](m3_lcdc_win_en_change_multiple/diff.png)    | ❌ Diff: 8169  |
| m3_lcdc_win_en_change_multiple_wx | ![](m3_lcdc_win_en_change_multiple_wx/expected.png) | ![](m3_lcdc_win_en_change_multiple_wx/result.png) | ![](m3_lcdc_win_en_change_multiple_wx/diff.png) | ❌ Diff: 4966  |
| m3_lcdc_win_map_change            | ![](m3_lcdc_win_map_change/expected.png)            | ![](m3_lcdc_win_map_change/result.png)            | ![](m3_lcdc_win_map_change/diff.png)            | ❌ Diff: 2052  |
| m3_obp0_change                    | ![](m3_obp0_change/expected.png)                    | ![](m3_obp0_change/result.png)                    | ![](m3_obp0_change/diff.png)                    | ❌ Diff: 414   |
| m3_scx_high_5_bits                | ![](m3_scx_high_5_bits/expected.png)                | ![](m3_scx_high_5_bits/result.png)                | ![](m3_scx_high_5_bits/diff.png)                | ❌ Diff: 6426  |
| m3_scx_low_3_bits                 | ![](m3_scx_low_3_bits/expected.png)                 | ![](m3_scx_low_3_bits/result.png)                 | ![](m3_scx_low_3_bits/diff.png)                 | ❌ Diff: 540   |
| m3_scy_change                     | ![](m3_scy_change/expected.png)                     | ![](m3_scy_change/result.png)                     | ![](m3_scy_change/diff.png)                     | ❌ Diff: 8750  |
| m3_window_timing                  | ![](m3_window_timing/expected.png)                  | ![](m3_window_timing/result.png)                  | ![](m3_window_timing/diff.png)                  | ❌ Diff: 665   |
| m3_window_timing_wx_0             | ![](m3_window_timing_wx_0/expected.png)             | ![](m3_window_timing_wx_0/result.png)             | ![](m3_window_timing_wx_0/diff.png)             | ❌ Diff: 954   |
| m3_wx_4_change                    | ![](m3_wx_4_change/expected.png)                    | ![](m3_wx_4_change/result.png)                    | ![](m3_wx_4_change/diff.png)                    | ❌ Diff: 229   |
| m3_wx_4_change_sprites            | ![](m3_wx_4_change_sprites/expected.png)            | ![](m3_wx_4_change_sprites/result.png)            | ![](m3_wx_4_change_sprites/diff.png)            | ❌ Diff: 10    |
| m3_wx_5_change                    | ![](m3_wx_5_change/expected.png)                    | ![](m3_wx_5_change/result.png)                    | ![](m3_wx_5_change/diff.png)                    | ❌ Diff: 638   |
| m3_wx_6_change                    | ![](m3_wx_6_change/expected.png)                    | ![](m3_wx_6_change/result.png)                    | ![](m3_wx_6_change/diff.png)                    | ❌ Diff: 13799 |

Generated at: 2021-06-19 13:10:35.357558 UTC, took 7s
