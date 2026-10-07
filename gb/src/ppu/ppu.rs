use arrayvec::ArrayVec;
use constants::DISPLAY_WIDTH;
use parse_display::Display;

use crate::{
    constants::{self, SPRITES_PER_LINE, TILE_SIZE},
    events::Events,
    interrupts::{InterruptBits, InterruptController},
    ppu::vram::BgToOamPriority,
    traits::MemoryAccess,
    utils::invalid_address,
};

use super::{
    fetcher::{BgFifo, Fetcher, FifoItem},
    oam::{Oam, Sprite, OAM_END, OAM_START},
    palettes::{ColorPaletteMemory, DmgPalette, DmgPalettes, Palette, Rgb},
    screen_buffer::{Buffer, ScreenBuffer},
    utils::{
        are_sprites_enabled, get_background_tile_map_address, get_oam_priority, get_sprites_height,
        get_window_tile_map_address, is_background_or_window_enable, is_lcd_enabled,
        is_window_enabled, transform_tile_number, LcdcBits, OamPriority, StatBits,
    },
    vram::{Tile, Vram, VRAM_END, VRAM_START},
};

use super::registers::*;

const CGB_REGISTERS: [u16; 6] = [R_BGPD, R_BGPI, R_OBPD, R_OBPI, R_OPRI, R_VBK];

const TOTAL_LINE_CLOCKS: u32 = 456;
// Every line is 456 dots long, LY changes at dot 0 of the line
const OAM_SCAN_END: u32 = 77;
const MODE3_START: u32 = 81;
// Dots before the next LY change when the OAM interrupt of the next line is armed
const OAM_INTERRUPT_BEFORE_LINE_END: u32 = 3;
// Dot when the LY comparison is disabled before the LY change on lines 143-152
const VBLANK_LY_COMPARE_RESET: u32 = TOTAL_LINE_CLOCKS - 3;
// Dot of the line 143 when the PPU internally enters V-Blank (and the OAM STAT interrupt fires)
const VBLANK_ENTER: u32 = TOTAL_LINE_CLOCKS - 1;
// The first line after the LCD is turned on is special - no OAM scan (STAT reports mode 0) and it's shorter
const FIRST_LINE_OAM_BLOCK: u32 = 79;
const FIRST_LINE_END: u32 = TOTAL_LINE_CLOCKS - 2;
// Line clock when the LCD is turned on (LCDC is written 2 T-cycles before the end of M-cycle),
// the LCD-on sequence then matches SameBoy (which turns the LCD on 1 T-cycle before the end)
const LCD_ON_LINE_CLOCKS: u32 = 1;
// The pixel pipeline (fetcher + FIFO) starts a few dots before STAT reports mode 3,
// the first line after LCD-on included (SameBoy reaches `mode_3_start` at the same dot)
const PIPELINE_START: u32 = 78;
// The first dot of the fetcher's first (junk) fetch
const FETCHER_START: u32 = 80;
// LX of the first visible pixel - LX 0-7 are the pixels of the junk tile (not drawn)
const FIRST_VISIBLE_LX: u8 = 8;
const LAST_LX: u8 = FIRST_VISIBLE_LX + DISPLAY_WIDTH as u8;
const WINDOW_ENABLE_DELAY: u8 = 1;
// Dots of the object fetch once the BG fetcher is ready (OAM read + 2 tile data reads)
const OBJECT_FETCH_DOTS: u8 = 6;
// Dots of the object fetch during which the BG fetcher still advances
const OBJECT_FETCH_BG_FETCHER_DOTS: u8 = 2;
// Dot of the line 144 when STAT enters mode 1 and V-Blank interrupt is requested
const VBLANK_START: u32 = 2;
const STAT_UNUSED_MASK: u8 = 0b1000_0000;
#[derive(PartialEq)]
enum Access {
    Read,
    Write,
}

#[derive(PartialEq, Eq, Clone, Copy, Debug)]
pub enum MapLayer {
    Background,
    Window,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug, Display)]
pub enum Mode {
    HBlank,        // m0
    VBlank,        // m1
    OamSearch,     // m2
    PixelTransfer, // m3
}

impl Mode {
    pub fn to_bits(self) -> u8 {
        match self {
            Mode::HBlank => 0b00,
            Mode::VBlank => 0b01,
            Mode::OamSearch => 0b10,
            Mode::PixelTransfer => 0b11,
        }
    }

    pub fn from_bits(bits: u8) -> Mode {
        match bits & 0b11 {
            0b00 => Mode::HBlank,
            0b01 => Mode::VBlank,
            0b10 => Mode::OamSearch,
            0b11 => Mode::PixelTransfer,
            _ => panic!("Unable to parse PPU mode from {}", bits),
        }
    }
}

pub struct Ppu {
    // Registers
    stat: StatBits,
    stat_mode: Mode,
    lcdc: LcdcBits,
    ly: u8,
    lyc: u8,
    scx: u8,
    scy: u8,
    wx: u8,
    wy: u8,
    opri: u8,

    // internals
    pub ly_to_compare: Option<u8>,
    window_line: u8,
    // LY=WY was seen (with the window enabled) during the frame
    window_wy_triggered: bool,
    // LCDC.5 of the last dots (bit 0 = the current dot)
    window_enabled_history: u8,
    // Pixels shifted out of the BG FIFO (after the SCX discard), the visible ones start at 8
    lx: u8,
    scx_discard_done: bool,
    pub prev_stat_flag: bool,
    pub line_clocks: u32,
    pub mode: Mode,
    pub line: u8,
    scx_discarded: u8,
    mode_for_interrupt: Option<Mode>,
    lyc_interrupt_line: bool,
    hblank_interrupt_at: Option<u32>,
    pipeline_active: bool,
    first_line_after_lcd_on: bool,
    oam_read_blocked: bool,
    oam_write_blocked: bool,
    vram_read_blocked: bool,
    vram_write_blocked: bool,
    skip_frames: u32,
    system_palette: DmgPalette,

    bg_color_palettes: ColorPaletteMemory,
    obj_color_palettes: ColorPaletteMemory,

    // Pre-computed palettes
    bgp_pal: Palette,
    obp0_pal: Palette,
    obp1_pal: Palette,

    screen_buffer: ScreenBuffer,

    line_tiles: [Option<(u8, BgToOamPriority)>; DISPLAY_WIDTH], // index = x, value = (color index,priority)
    // Pixel pipeline - the fetcher produces tile slices, the FIFO consumes them one pixel per dot.
    // The PPU orchestrates both (window trigger, SCX discard, pixel output).
    fetcher: Fetcher,
    bg_fifo: BgFifo,
    // OAM X of the objects selected for the line (sorted), the objects with X < LX are done
    line_objects_x: ArrayVec<u8, SPRITES_PER_LINE>,
    next_object: usize,
    // Dots done of the current object fetch (0 - no fetch in progress)
    object_fetch_dots: u8,

    is_cgb: bool,

    // RAM
    pub vram: Vram,
    pub oam: Oam,
}

impl Ppu {
    pub fn new(is_cgb: bool) -> Ppu {
        let system_palette = DmgPalettes::Gray.get_palette();
        Ppu {
            stat_mode: Mode::HBlank,
            lcdc: LcdcBits::empty(),
            stat: StatBits::empty(),
            ly: 0,
            lyc: 0,
            scx: 0,
            scy: 0,
            wx: 0,
            wy: 0,
            opri: 0,

            // internals
            ly_to_compare: Some(0),
            window_line: 0,
            window_wy_triggered: false,
            window_enabled_history: 0,
            lx: 0,
            scx_discard_done: false,
            prev_stat_flag: false,
            line_clocks: 0,
            mode: Mode::HBlank,
            line: 0,
            mode_for_interrupt: None,
            lyc_interrupt_line: false,
            hblank_interrupt_at: None,
            pipeline_active: false,
            first_line_after_lcd_on: false,
            oam_read_blocked: false,
            oam_write_blocked: false,
            vram_read_blocked: false,
            vram_write_blocked: false,
            skip_frames: 0,
            system_palette,

            bg_color_palettes: ColorPaletteMemory::new(),
            obj_color_palettes: ColorPaletteMemory::new(),
            bgp_pal: Palette::empty(),
            obp0_pal: Palette::empty(),
            obp1_pal: Palette::empty(),

            scx_discarded: 0,

            screen_buffer: ScreenBuffer::new(),
            fetcher: Fetcher::new(is_cgb),
            bg_fifo: BgFifo::new(),
            line_tiles: [None; DISPLAY_WIDTH],
            line_objects_x: ArrayVec::new(),
            next_object: 0,
            object_fetch_dots: 0,

            is_cgb,

            // RAM
            vram: Vram::new(),
            oam: Oam::new(),
        }
    }

    pub fn init_without_bios(&mut self) {
        self.lcdc = LcdcBits::from_bits_truncate(0x91);
        self.stat = StatBits::from_bits_truncate(0x80);
        self.scy = 0x00;
        self.scx = 0x00;
        self.lyc = 0x00;
        self.bgp_pal = Palette::from_bits(0xfc, &self.system_palette);
        self.obp0_pal = Palette::from_bits(0xff, &self.system_palette);
        self.obp1_pal = Palette::from_bits(0xff, &self.system_palette);
        self.wy = 0x00;
        self.wx = 0x00;
        // The boot ROM leaves PPU at the very beginning of the line 0 (the timing is relevant
        // for tests which don't turn the LCD off/on)
        self.line = 0;
        self.ly = 0;
        self.line_clocks = 1;
        self.ly_to_compare = Some(0);
    }

    /// DMG boot ROM leaves the logo (from the cartridge header) and the (R) tile in VRAM,
    /// some tests rely on it (e.g. mealybug `m3_scx_*` tests render the (R) tile)
    pub fn init_boot_vram(&mut self, header_logo: &[u8]) {
        if self.is_cgb {
            return;
        }

        // Each logo nibble is scaled 2x (both horizontally and vertically), the boot ROM
        // writes only the low bitplane
        let mut address = 0x8010;
        for byte in header_logo {
            for nibble in [byte >> 4, byte & 0x0f] {
                let doubled = (0..4).fold(0u8, |acc, bit| {
                    let b = (nibble >> (3 - bit)) & 1;
                    (acc << 2) | (b << 1) | b
                });
                for _ in 0..2 {
                    self.vram.write_byte(address, doubled);
                    address += 2;
                }
            }
        }

        // (R) tile
        const REGISTERED_TILE: [u8; 8] = [0x3c, 0x42, 0xb9, 0xa5, 0xb9, 0xa5, 0x42, 0x3c];
        for (i, row) in REGISTERED_TILE.iter().enumerate() {
            self.vram.write_byte(0x8190 + i as u16 * 2, *row);
        }

        // Tile map - logo tiles 0x01-0x18 in two rows, (R) at the end of the first row
        self.vram.write_byte(0x9910, 0x19);
        for i in 0..12u16 {
            self.vram.write_byte(0x9904 + i, 0x01 + i as u8);
            self.vram.write_byte(0x9924 + i, 0x0d + i as u8);
        }
    }

    pub fn tick(&mut self, ic: &mut InterruptController, events: &mut Events) {
        if !is_lcd_enabled(&self.lcdc) {
            return;
        }

        self.window_enabled_history =
            (self.window_enabled_history << 1) | is_window_enabled(&self.lcdc) as u8;

        if self.line < 144 {
            self.process_screen_line(ic, events);
        } else {
            self.process_vblank_line(ic);
        }

        // The window WY condition is checked on every dot and holds for the rest of the frame
        if is_window_enabled(&self.lcdc) && self.ly == self.wy {
            self.window_wy_triggered = true;
        }

        self.line_clocks += 1;
        let line_length = self.line_length();
        if self.line_clocks == line_length {
            self.line_clocks = 0;
            self.first_line_after_lcd_on = false;
            self.line = if self.line == 153 { 0 } else { self.line + 1 };
        }
    }

    fn line_length(&self) -> u32 {
        if self.first_line_after_lcd_on {
            FIRST_LINE_END
        } else {
            TOTAL_LINE_CLOCKS
        }
    }

    fn change_stat_mode(&mut self, mode: Mode) {
        self.stat_mode = mode;
    }

    // Timing of the events is relative to the LY change (dot 0) and it's based on SameBoy
    fn process_screen_line(&mut self, ic: &mut InterruptController, events: &mut Events) {
        // 2   -> 3              -> 0
        // OAM -> PIXEL TRANSFER -> H-BLANK
        let first_line = self.first_line_after_lcd_on;
        match self.line_clocks {
            0 if !first_line => {
                // STAT reads mode 0 for a single dot, but the OAM interrupt is already requested
                self.ly = self.line;
                self.change_stat_mode(Mode::HBlank);
                self.oam_read_blocked = true;
                self.oam_write_blocked = false;
                if self.line != 0 {
                    self.ly_to_compare = None;
                    self.mode_for_interrupt = Some(Mode::OamSearch);
                }
                self.stat_update(ic);
            }
            1 if !first_line => {
                self.mode = Mode::OamSearch;
                self.change_stat_mode(Mode::OamSearch);
                self.oam_write_blocked = true;
                self.ly_to_compare = Some(self.ly);
                self.mode_for_interrupt = Some(Mode::OamSearch);
                self.stat_update(ic);
                // OAM interrupt is just a short pulse
                self.mode_for_interrupt = None;
                self.stat_update(ic);
            }
            OAM_SCAN_END if !first_line => {
                self.vram_read_blocked = true;
                self.oam_write_blocked = false;
            }
            FIRST_LINE_OAM_BLOCK if first_line => {
                self.oam_write_blocked = true;
            }
            MODE3_START => {
                self.mode = Mode::PixelTransfer;
                self.change_stat_mode(Mode::PixelTransfer);
                self.mode_for_interrupt = None;
                self.oam_read_blocked = true;
                self.oam_write_blocked = true;
                self.vram_read_blocked = true;
                self.vram_write_blocked = true;
                if !first_line {
                    self.stat_update(ic);
                }
                self.screen_buffer.get_write_buffer_mut().set_stats(
                    Mode::PixelTransfer,
                    self.line as usize,
                    self.line_clocks,
                );
            }
            clocks
                if self.line != 143
                    && clocks == self.line_length() - OAM_INTERRUPT_BEFORE_LINE_END =>
            {
                // Not propagated until the next STAT update
                self.mode_for_interrupt = Some(Mode::OamSearch);
            }
            VBLANK_LY_COMPARE_RESET if self.line == 143 => {
                self.ly_to_compare = None;
                self.stat_update(ic);
            }
            VBLANK_ENTER if self.line == 143 => {
                self.mode = Mode::VBlank;
                if !self.prev_stat_flag && self.stat.contains(StatBits::OAM_INTERRUPT) {
                    ic.request_interrupt(InterruptBits::LCD_STATS);
                }
            }
            _ => {}
        }

        if self.line_clocks == PIPELINE_START {
            self.init_pixel_transfer();
        }

        match self.mode {
            Mode::OamSearch | Mode::PixelTransfer
                if self.pipeline_active && self.line_clocks >= FETCHER_START =>
            {
                self.process_pixel_transfer();

                if self.lx == LAST_LX {
                    self.pipeline_active = false;
                    self.mode = Mode::HBlank;
                    self.change_stat_mode(Mode::HBlank);
                    self.hblank_interrupt_at = Some(self.line_clocks + 1);
                    self.oam_read_blocked = false;
                    self.oam_write_blocked = false;
                    self.vram_read_blocked = false;
                    self.vram_write_blocked = false;

                    self.render_sprites();

                    self.screen_buffer.get_write_buffer_mut().set_stats(
                        Mode::HBlank,
                        self.line as usize,
                        self.line_clocks,
                    );
                }
            }
            Mode::HBlank => {
                // HBlank interrupt is triggered one dot after STAT reports mode 0
                if self.hblank_interrupt_at == Some(self.line_clocks) {
                    self.hblank_interrupt_at = None;
                    self.mode_for_interrupt = Some(Mode::HBlank);
                    self.stat_update(ic);
                }
            }
            _ => {}
        }

        if self.line == 143 && self.line_clocks == VBLANK_ENTER - 1 && self.skip_frames == 0 {
            events.insert(Events::V_BLANK);
            self.screen_buffer.commit_frame();
        }
    }

    fn process_vblank_line(&mut self, ic: &mut InterruptController) {
        match (self.line, self.line_clocks) {
            (144..=152, 0) => {
                self.ly = self.line;
            }
            (144..=152, 1) => {
                self.ly_to_compare = Some(self.ly);
                self.stat_update(ic);
            }
            (144, VBLANK_START) => {
                // Entering VBlank triggers the OAM interrupt as well
                self.change_stat_mode(Mode::VBlank);
                ic.request_interrupt(InterruptBits::V_BLANK);
                if !self.prev_stat_flag && self.stat.contains(StatBits::OAM_INTERRUPT) {
                    ic.request_interrupt(InterruptBits::LCD_STATS);
                }
                self.mode_for_interrupt = Some(Mode::VBlank);
                self.stat_update(ic);
            }
            (144..=152, VBLANK_LY_COMPARE_RESET) => {
                self.ly_to_compare = None;
                self.stat_update(ic);
            }
            // Line 153 reports LY=153 only for a few dots, then LY=0
            (153, 0) => {
                self.ly = 153;
            }
            (153, 3) => {
                self.ly = 0;
                self.ly_to_compare = Some(153);
                self.stat_update(ic);
            }
            (153, 5) => {
                self.ly_to_compare = None;
                self.stat_update(ic);
            }
            (153, 9) => {
                self.ly_to_compare = Some(0);
                self.stat_update(ic);
            }
            (153, clocks) if clocks == TOTAL_LINE_CLOCKS - 1 => {
                if self.skip_frames > 0 {
                    self.skip_frames -= 1;
                }
                self.window_line = 0;
                self.window_wy_triggered = false;
            }
            _ => {}
        }
    }

    fn stat_update(&mut self, ic: &mut InterruptController) {
        if !is_lcd_enabled(&self.lcdc) {
            return;
        }

        // LY=LYC flag, the comparison is not performed during LY changes (the flag is cleared, the interrupt line remains)
        match self.ly_to_compare {
            Some(ly) => {
                self.lyc_interrupt_line = ly == self.lyc;
                self.stat
                    .set(StatBits::LYC_EQUALS_LY_FLAG, self.lyc_interrupt_line);
            }
            None => self.stat.remove(StatBits::LYC_EQUALS_LY_FLAG),
        }

        let mode_intr = match self.mode_for_interrupt {
            Some(Mode::OamSearch) => self.stat.contains(StatBits::OAM_INTERRUPT),
            Some(Mode::HBlank) => self.stat.contains(StatBits::H_BLANK_INTERRUPT),
            Some(Mode::VBlank) => self.stat.contains(StatBits::V_BLANK_INTERRUPT),
            _ => false,
        };

        let ly_equals_ly_intr =
            self.lyc_interrupt_line && self.stat.contains(StatBits::LYC_EQUALS_LY_INTERRUPT);

        let stat_flag = mode_intr || ly_equals_ly_intr;

        if !self.prev_stat_flag && stat_flag {
            ic.request_interrupt(InterruptBits::LCD_STATS);
        }
        self.prev_stat_flag = stat_flag;
    }

    fn unblock_memory(&mut self) {
        self.oam_read_blocked = false;
        self.oam_write_blocked = false;
        self.vram_read_blocked = false;
        self.vram_write_blocked = false;
    }

    fn turn_lcd_on(&mut self, ic: &mut InterruptController) {
        // The first line is special - no OAM scan, STAT reports mode 0 until pixel transfer starts
        self.line = 0;
        self.ly = 0;
        self.line_clocks = LCD_ON_LINE_CLOCKS;
        self.first_line_after_lcd_on = true;
        self.pipeline_active = false;
        self.mode = Mode::OamSearch;
        self.change_stat_mode(Mode::HBlank);
        self.mode_for_interrupt = None;
        self.hblank_interrupt_at = None;
        self.ly_to_compare = Some(0);
        self.unblock_memory();
        // Only LY=LYC can trigger STAT interrupt now
        self.stat_update(ic);

        // The first frame (after LCD is turned on) is skipped
        self.skip_frames = 1;
    }

    fn init_pixel_transfer(&mut self) {
        self.pipeline_active = true;
        self.lx = 0;
        self.scx_discarded = 0;
        self.scx_discard_done = false;

        // Reset
        for x in self.line_tiles.iter_mut() {
            *x = None;
        }

        self.bg_fifo.clear();
        self.fetcher.start_line();

        // The first 10 objects (in OAM order) on the line, sorted by X (OAM order on the same X)
        let sprite_height = get_sprites_height(&self.lcdc) as isize;
        let line = self.ly as isize;
        self.line_objects_x = self
            .oam
            .sprites
            .iter()
            .filter(|sprite| sprite.y <= line && line < sprite.y + sprite_height)
            .take(SPRITES_PER_LINE)
            .map(|sprite| (sprite.x + 8) as u8)
            .collect();
        self.line_objects_x.sort();
        self.next_object = 0;
        self.object_fetch_dots = 0;
    }

    /// Object fetch stalls the pixel pipeline when LX matches the object X.
    /// Returns true if the pipeline is stalled in this dot.
    fn process_object_fetch(&mut self) -> bool {
        if self.object_fetch_dots == 0 {
            while self
                .line_objects_x
                .get(self.next_object)
                .is_some_and(|&x| x < self.lx)
            {
                self.next_object += 1;
            }

            // DMG skips the objects entirely when they are disabled
            let objects_enabled = self.is_cgb || are_sprites_enabled(&self.lcdc);
            if !objects_enabled || self.line_objects_x.get(self.next_object) != Some(&self.lx) {
                return false;
            }

            // The window trigger at the same LX goes first, the object then waits for
            // the first window tile. Mealybug `m3_lcdc_tile_sel_win_change`.
            if self.window_triggers_at_lx() {
                return false;
            }

            // Wait for the BG fetcher to finish its tile data fetch (and for the BG FIFO to fill)
            if !self.fetcher.is_ready_for_object() || self.bg_fifo.is_empty() {
                self.tick_fetcher();
                return true;
            }
        }

        if self.object_fetch_dots < OBJECT_FETCH_BG_FETCHER_DOTS {
            self.tick_fetcher();
        }
        self.object_fetch_dots += 1;
        if self.object_fetch_dots == OBJECT_FETCH_DOTS {
            self.object_fetch_dots = 0;
            self.next_object += 1;
        }
        true
    }

    /// Returns true if the fetcher pushed pixels to the BG FIFO
    fn tick_fetcher(&mut self) -> bool {
        self.fetcher.tick(
            &self.vram,
            &self.lcdc,
            self.scx,
            self.ly.wrapping_add(self.scy),
            &mut self.bg_fifo,
        )
    }

    fn process_pixel_transfer(&mut self) {
        let bg_enabled = is_background_or_window_enable(&self.lcdc);
        let scx_discard = self.scx % (TILE_SIZE as u8);
        let first_fetch = self.fetcher.is_first_fetch();

        if self.process_object_fetch() {
            return;
        }

        let pushed = self.tick_fetcher();

        let window_can_trigger = self.window_can_trigger();

        // SCX discard - the first SCX % 8 pixels are discarded before LX starts counting.
        // SCX is compared live on every dot until it matches the discarded pixels count.
        if !self.scx_discard_done {
            // WX=0 with SCX % 8 > 0 - the window is triggered before the SCX discard
            // (when the junk tile is pushed), 1 dot late. The discard then applies to the window.
            if pushed && window_can_trigger && self.wx == 0 && scx_discard > 0 {
                self.start_window(true);
                return;
            }

            if self.bg_fifo.is_empty() {
                return;
            }
            if self.scx_discarded != scx_discard {
                self.bg_fifo.shift();
                self.scx_discarded = (self.scx_discarded + 1) % (TILE_SIZE as u8);
                return;
            }
            self.scx_discard_done = true;
        }

        if self.bg_fifo.is_empty() {
            return;
        }

        if self.window_triggers_at_lx() {
            self.start_window(false);
            return;
        }

        let wx_lx = self.wx as u16 + 1;
        let lx = self.lx as u16;

        // 00 pixel glitch - if LX matches WX when a tile is pushed, a color 0 pixel is shifted out
        // instead and the tile is delayed by 1 dot. Happens if the window WY condition was met
        // in the frame, even for the BG. Not for the first window tile after the trigger.
        // On CGB only while the window is active.
        let insert_pixel = pushed
            && lx == wx_lx
            && self.window_wy_triggered
            && !first_fetch
            && (!self.is_cgb || self.fetcher.layer == MapLayer::Window);

        let fifo_item = if insert_pixel {
            FifoItem::EMPTY
        } else {
            let Some(fifo_item) = self.bg_fifo.shift() else {
                return;
            };
            fifo_item
        };

        // LX 0-7 - the pixels are shifted out, but not drawn
        self.lx += 1;
        if self.lx <= FIRST_VISIBLE_LX {
            return;
        }
        let x = (self.lx - FIRST_VISIBLE_LX - 1) as usize;

        let bg_layer_enabled = self.is_cgb || bg_enabled;
        if bg_layer_enabled {
            let palette = if self.is_cgb {
                self.bg_color_palettes.get_palette(fifo_item.palette)
            } else {
                &self.bgp_pal
            };

            let color = palette.colors[fifo_item.color_number as usize];
            let priority = self.get_bg_tile_priority(&fifo_item);
            self.line_tiles[x] = Some((fifo_item.color_number, priority));

            self.render_pixel(x, &color);
        } else {
            // TODO is this true for CGB?
            let color = self.bgp_pal.colors[0];
            self.render_pixel(x, &color);
        }
    }

    fn window_can_trigger(&self) -> bool {
        self.window_wy_triggered
            && self.window_enabled_seen(0)
            && self.fetcher.layer != MapLayer::Window
    }

    /// Window trigger - LX matches WX (LX 0-7 included, WX < 7 triggers while the junk tile
    /// is shifted out). The trigger doesn't depend on LCDC.0, the window just isn't rendered.
    /// DMG - if the window has just been enabled, it's triggered also 1 dot late.
    /// The window doesn't trigger at WX=166 on DMG.
    fn window_triggers_at_lx(&self) -> bool {
        let max_wx = if self.is_cgb { 166 } else { 165 };
        let wx_lx = self.wx as u16 + 1;
        let lx = self.lx as u16;
        self.window_can_trigger()
            && self.wx <= max_wx
            && (lx == wx_lx || (!self.is_cgb && !self.window_enabled_seen(1) && lx == wx_lx + 1))
    }

    fn window_enabled_seen(&self, dots_ago: u8) -> bool {
        (self.window_enabled_history >> (WINDOW_ENABLE_DELAY + dots_ago)) & 1 == 1
    }

    /// `delayed` - the window fetch starts 1 dot later
    fn start_window(&mut self, delayed: bool) {
        self.bg_fifo.clear();
        self.fetcher.start_window(self.window_line);
        self.window_line = self.window_line.wrapping_add(1);
        // The trigger dot is the first dot of the window tile ID fetch
        if !delayed {
            self.fetcher.latch(&self.lcdc, self.scx);
        }
    }

    fn get_bg_tile_priority(&self, fifo_item: &FifoItem) -> BgToOamPriority {
        if !self.is_cgb {
            return BgToOamPriority::OamPriorityBit;
        }
        if self.lcdc.bits() & 0b0000_0001 == 0 {
            return BgToOamPriority::OamPriorityBit;
        }
        fifo_item.priority
    }

    fn render_pixel(&mut self, x: usize, pixel: &Rgb) {
        self.screen_buffer
            .get_write_buffer_mut()
            .set_pixel(x, self.ly as usize, pixel)
    }

    fn collect_sprites(&self) -> ArrayVec<&Sprite, SPRITES_PER_LINE> {
        let sprite_height = get_sprites_height(&self.lcdc) as isize;

        let current_line = self.ly as isize;

        // OAM scan selects the first 10 objects on the line in OAM order (X is not checked)
        let mut sprites: ArrayVec<&Sprite, SPRITES_PER_LINE> = self
            .oam
            .sprites
            .iter()
            .filter(|sprite| sprite.y <= current_line && current_line < sprite.y + sprite_height)
            .take(SPRITES_PER_LINE)
            .collect();

        // Drawing priority - lower X wins, stable sort keeps OAM order for equal X
        if !self.is_cgb || get_oam_priority(self.opri) == OamPriority::XPosition {
            sprites.sort_by_key(|sprite| sprite.x);
        }

        sprites
    }

    fn render_sprites(&mut self) {
        if !are_sprites_enabled(&self.lcdc) {
            return;
        }

        // 10 pixels per max 8 pixels = 80
        let pixels: ArrayVec<(usize, usize, Rgb, bool), 80> = self
            .collect_sprites()
            .into_iter()
            .rev()
            .flat_map(|sprite| self.render_sprite(sprite))
            .collect();
        let screen_buffer = self.screen_buffer.get_write_buffer_mut();

        // TODO refactor this sh**
        for (x, y, pixel, is_above_bg) in pixels {
            if self.is_cgb {
                let obj_on_top = self.lcdc.bits() & 1 == 0;
                let line_tile_attributes = self.line_tiles[x];
                let bg_is_zero = line_tile_attributes.is_some_and(|pair| pair.0 == 0);
                let bg_has_priority =
                    line_tile_attributes.is_some_and(|pair| pair.1 == BgToOamPriority::BgPriority);

                if obj_on_top || bg_is_zero || (is_above_bg && !bg_has_priority) {
                    screen_buffer.set_pixel(x, y, &pixel);
                }
            } else {
                if !is_above_bg {
                    let current_pixel = screen_buffer.get_pixel(x, y);
                    if current_pixel != self.bgp_pal.colors[0] {
                        continue;
                    }
                }
                screen_buffer.set_pixel(x, y, &pixel);
            }
        }
    }

    fn render_sprite(&self, sprite: &Sprite) -> ArrayVec<(usize, usize, Rgb, bool), 8> {
        let sprite_height = get_sprites_height(&self.lcdc) as isize;
        let palette = if sprite.palette == 0 {
            &self.obp0_pal
        } else {
            &self.obp1_pal
        };
        let current_line = self.ly as isize;

        let y = if sprite.is_y_flipped {
            sprite_height - 1 - (current_line - sprite.y)
        } else {
            current_line - sprite.y
        };

        let mut pixels: ArrayVec<_, 8> = ArrayVec::new();
        for x in sprite.x..(sprite.x + 8) {
            if x < 0 || x >= DISPLAY_WIDTH as isize {
                continue;
            }
            let extra_offset = (y as usize >> 3) & 1; // double sprite height -> take next tile
            let tile_number = if sprite_height == 16 {
                // bit 0 of the tile index is ignored for 8x16 objects
                sprite.tile_number & 0xfe
            } else {
                sprite.tile_number
            };

            let bank = if self.is_cgb {
                sprite.tile_vram_bank
            } else {
                0
            };
            let tile = self.vram.get_tile(tile_number + extra_offset, bank);
            let x_index = x - sprite.x;
            let tile_row = y as usize;
            let tile_col = if sprite.is_x_flipped {
                7 - x_index
            } else {
                x_index
            } as usize;

            // & 7 - double sprite height
            let pixel = tile.get_at(tile_col, tile_row & 7);

            // 0 is always transparent
            if pixel == 0 {
                continue;
            }

            let obj_palette = if self.is_cgb {
                self.obj_color_palettes
                    .get_palette(sprite.cgb_palette as u8)
            } else {
                palette
            };
            let color = obj_palette.colors[pixel as usize];
            pixels.push((x as usize, current_line as usize, color, sprite.is_above_bg));
        }
        pixels
    }

    fn can_access_oam(&self, access: Access) -> bool {
        match access {
            Access::Read => !self.oam_read_blocked,
            Access::Write => !self.oam_write_blocked,
        }
    }

    fn can_access_vram(&self, access: Access) -> bool {
        match access {
            Access::Read => !self.vram_read_blocked,
            Access::Write => !self.vram_write_blocked,
        }
    }
}

impl Ppu {
    pub fn get_screen_buffer(&self) -> &Buffer {
        self.screen_buffer.get_read_buffer()
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_LCDC => self.lcdc.bits(),
            R_LY => self.ly,
            R_LYC => self.lyc,
            R_STAT => self.stat.bits() | STAT_UNUSED_MASK | self.stat_mode.to_bits(),
            R_SCX => self.scx,
            R_SCY => self.scy,
            R_WX => self.wx,
            R_WY => self.wy,
            R_BGP => self.bgp_pal.bits(),
            R_OBP0 => self.obp0_pal.bits(),
            R_OBP1 => self.obp1_pal.bits(),
            VRAM_START..=VRAM_END => {
                if !self.can_access_vram(Access::Read) {
                    return 0xff;
                }
                self.vram.read_byte(address)
            }
            OAM_START..=OAM_END => {
                if !self.can_access_oam(Access::Read) {
                    return 0xff;
                }
                self.oam.read_byte(address)
            }
            _ => {
                if self.is_cgb {
                    return match address {
                        R_BGPI => self.bg_color_palettes.read_index(),
                        R_BGPD => self.bg_color_palettes.read_data(),
                        R_OBPI => self.obj_color_palettes.read_index(),
                        R_OBPD => self.obj_color_palettes.read_data(),
                        R_OPRI => self.opri | 0b1111_1110,
                        R_VBK => self.vram.read_byte(address),
                        _ => invalid_address("PPU (read)", address),
                    };
                }
                if CGB_REGISTERS.contains(&address) {
                    return 0xff;
                }
                invalid_address("PPU (read)", address)
            }
        }
    }

    // DMG bug: STAT behaves as if 0xff was written for a single T-cycle (the CPU then writes the real value),
    // this can trigger the STAT interrupt
    pub fn write_stat_bug(&mut self, ic: &mut InterruptController) {
        if self.is_cgb {
            return;
        }
        let lyc_flag = self.stat & StatBits::LYC_EQUALS_LY_FLAG;
        self.stat = (StatBits::all() - StatBits::LYC_EQUALS_LY_FLAG) | lyc_flag;
        self.stat_update(ic);
    }

    pub fn write_byte(&mut self, address: u16, value: u8, ic: &mut InterruptController) {
        match address {
            R_LCDC => {
                let was_enabled = is_lcd_enabled(&self.lcdc);
                self.lcdc = LcdcBits::from_bits_truncate(value);
                let is_enabled = is_lcd_enabled(&self.lcdc);
                // off - on
                if !was_enabled && is_enabled {
                    self.turn_lcd_on(ic);
                }

                // On -> off
                if was_enabled && !is_enabled {
                    self.ly = 0;
                    self.ly_to_compare = Some(0);
                    self.line = 0;
                    self.line_clocks = 0;
                    self.mode = Mode::HBlank;
                    self.change_stat_mode(Mode::HBlank);
                    self.hblank_interrupt_at = None;
                    self.first_line_after_lcd_on = false;
                    self.unblock_memory();
                    self.screen_buffer
                        .get_write_buffer_mut()
                        .clear_with(&self.system_palette.colors[0]);
                }
            }
            R_LY => {} // read-only
            R_LYC => {
                self.lyc = value;
                self.stat_update(ic);
            }
            R_STAT => {
                let mut new_stat = StatBits::from_bits_truncate(value);
                // LY=LYC is not writeable
                new_stat.remove(StatBits::LYC_EQUALS_LY_FLAG);
                let lyc_flag = self.stat & StatBits::LYC_EQUALS_LY_FLAG;
                self.stat = lyc_flag | new_stat;
                self.stat_update(ic);
            }
            R_SCX => self.scx = value,
            R_SCY => self.scy = value,
            R_WX => self.wx = value,
            R_WY => self.wy = value,
            R_BGP => self.bgp_pal = Palette::from_bits(value, &self.system_palette),
            R_OBP0 => self.obp0_pal = Palette::from_bits(value, &self.system_palette),
            R_OBP1 => self.obp1_pal = Palette::from_bits(value, &self.system_palette),

            VRAM_START..=VRAM_END => {
                if !self.can_access_vram(Access::Write) {
                    return;
                }
                self.vram.write_byte(address, value);
            }
            OAM_START..=OAM_END => {
                if !self.can_access_oam(Access::Write) {
                    return;
                }
                self.oam.write_byte(address, value);
            }
            _ => {
                if self.is_cgb {
                    return match address {
                        R_BGPI => self.bg_color_palettes.write_index(value),
                        R_BGPD => self.bg_color_palettes.write_data(value),
                        R_OBPI => self.obj_color_palettes.write_index(value),
                        R_OBPD => self.obj_color_palettes.write_data(value),
                        R_OPRI => self.opri = value & 1,
                        R_VBK => self.vram.write_byte(address, value),
                        _ => invalid_address("PPU (write)", address),
                    };
                }
                if CGB_REGISTERS.contains(&address) {
                    return;
                }
                invalid_address("PPU (write)", address)
            }
        }
    }
}

// Debug info
impl Ppu {
    pub fn set_system_palette(&mut self, palette: &DmgPalettes) {
        self.system_palette = palette.get_palette();
        self.bgp_pal.change_system_palette(&self.system_palette);
        self.obp0_pal.change_system_palette(&self.system_palette);
        self.obp1_pal.change_system_palette(&self.system_palette);
    }

    pub fn get_tile(&self, index: usize, layer: MapLayer) -> &Tile {
        let base_address = match layer {
            MapLayer::Background => get_background_tile_map_address(&self.lcdc),
            MapLayer::Window => get_window_tile_map_address(&self.lcdc),
        } as usize;

        let n = self.vram.memory[base_address + index];
        let tile_number = transform_tile_number(&self.lcdc, n);

        &self.vram.tiles[tile_number]
    }

    pub fn get_backround_palette(&self) -> &Palette {
        &self.bgp_pal
    }

    pub fn get_background_pos(&self) -> (u8, u8, bool) {
        (
            self.scx,
            self.scy,
            is_background_or_window_enable(&self.lcdc),
        )
    }

    pub fn get_window_pos(&self) -> (u8, u8, bool) {
        (
            self.wx,
            self.wy,
            is_background_or_window_enable(&self.lcdc) && is_window_enabled(&self.lcdc),
        )
    }
}
