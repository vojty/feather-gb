use std::collections::HashMap;

use constants::DISPLAY_WIDTH;
use parse_display::Display;

use crate::{
    constants::{self, TILE_SIZE},
    interrupts::{InterruptBits, InterruptController},
    ppu::vram::BgToOamPriority,
    traits::MemoryAccess,
    utils::get_invalid_address,
};

use super::{
    fetcher::{Fetcher, FifoItem},
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

use super::registers::{
    R_BGP, R_BGPD, R_BGPI, R_LCDC, R_LY, R_LYC, R_OBP0, R_OBP1, R_OBPD, R_OBPI, R_OPRI, R_SCX,
    R_SCY, R_STAT, R_VBK, R_WX, R_WY,
};

const TOTAL_LINE_CLOCKS: u32 = 456;
const STAT_UNUSED_MASK: u8 = 0b1000_0000;
#[derive(PartialEq)]
enum Access {
    Read,
    Write,
}

#[derive(PartialEq, Clone, Copy, Debug)]
pub enum MapLayer {
    Background,
    Window,
}

#[derive(Clone, Copy, PartialEq, Debug, Display)]
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
    window_line_enabled: bool,
    window_x: i32,
    x: u8,
    sampled_scx: u8,
    pub prev_stat_flag: bool,
    pub line_clocks: u32,
    pub mode: Mode,
    pub line: u8,
    dropped_pixels: u8,
    pending_mode: Option<Mode>,
    skip_frames: u32,
    system_palette: DmgPalette,

    bg_color_palettes: ColorPaletteMemory,
    obj_color_palettes: ColorPaletteMemory,

    // Pre-computed palettes
    bgp_pal: Palette,
    obp0_pal: Palette,
    obp1_pal: Palette,

    screen_buffer: ScreenBuffer,

    line_tiles: HashMap<u8, (u8, BgToOamPriority)>, // key = x, value = (color index,priority)
    fetcher: Fetcher,

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
            window_x: 0,
            window_line_enabled: false,
            x: 0,
            sampled_scx: 0,
            prev_stat_flag: false,
            line_clocks: 0,
            mode: Mode::HBlank,
            line: 0,
            pending_mode: None,
            skip_frames: 0,
            system_palette,

            bg_color_palettes: ColorPaletteMemory::new(),
            obj_color_palettes: ColorPaletteMemory::new(),
            bgp_pal: Palette::empty(),
            obp0_pal: Palette::empty(),
            obp1_pal: Palette::empty(),

            dropped_pixels: 0,

            screen_buffer: ScreenBuffer::new(),
            fetcher: Fetcher::new(is_cgb),
            line_tiles: HashMap::new(),

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
    }

    pub fn tick(&mut self, ic: &mut InterruptController) {
        if !is_lcd_enabled(&self.lcdc) {
            self.line_clocks = 0;
            return;
        }

        self.line_clocks += 1;

        // Mode change is delayed
        if let Some(pending_mode) = self.pending_mode {
            self.change_stat_mode(pending_mode);
            self.stat_update(ic, pending_mode);
            self.pending_mode = None;
        }

        if self.line < 144 {
            self.process_screen_line(ic);
        } else {
            self.process_vblank_line(ic);
        }
    }

    fn change_stat_mode(&mut self, mode: Mode) {
        self.stat_mode = mode;
    }

    fn process_screen_line(&mut self, ic: &mut InterruptController) {
        // 2   -> 3              -> 0
        // OAM -> PIXEL TRANSFER -> H-BLANK

        // LY=LYC handler
        match self.line_clocks {
            // Line to compare is 4 cycles late
            4 => {
                // the check for 0 line is performed during line 153 or when LCD is turned on
                if self.line != 0 {
                    self.ly_to_compare = Some(self.ly);
                    self.check_ly_equals_lyc(ic);
                }
            }
            _ => {}
        }

        match self.mode {
            Mode::OamSearch => {
                // window is enabled for current line only if WY=LY
                if self.wy == self.ly {
                    self.window_line_enabled = true
                }
                if self.line_clocks == 80 {
                    self.mode = Mode::PixelTransfer;
                    self.pending_mode = Some(Mode::PixelTransfer);
                    self.init_pixel_transfer();
                    self.screen_buffer.get_write_buffer_mut().set_stats(
                        Mode::PixelTransfer,
                        self.line as usize,
                        self.line_clocks,
                    );
                }
            }
            Mode::PixelTransfer => {
                self.process_pixel_transfer();

                if self.x == DISPLAY_WIDTH as u8 {
                    self.pending_mode = Some(Mode::HBlank);
                    self.mode = Mode::HBlank;

                    self.render_sprites();

                    self.screen_buffer.get_write_buffer_mut().set_stats(
                        Mode::HBlank,
                        self.line as usize,
                        self.line_clocks,
                    );
                }
            }
            Mode::HBlank => {
                if self.line_clocks == TOTAL_LINE_CLOCKS {
                    self.line_clocks = 0;
                    self.ly += 1;
                    self.line += 1;
                    self.ly_to_compare = None;
                    self.check_ly_equals_lyc(ic);

                    match self.ly {
                        0..=143 => {
                            self.mode = Mode::OamSearch;
                            self.pending_mode = Some(Mode::OamSearch);
                        }
                        144 => {
                            self.mode = Mode::VBlank;
                            self.pending_mode = Some(Mode::VBlank);
                            self.window_line_enabled = false;

                            if self.skip_frames == 0 {
                                self.screen_buffer.commit_frame();
                            }
                        }
                        line => panic!("Invalid screen line {}", line),
                    }
                }
            }
            Mode::VBlank => panic!("VBlank should not be processed here, line={}", self.line),
        }
    }

    fn process_vblank_line(&mut self, ic: &mut InterruptController) {
        match self.line {
            144..=152 => {
                match self.line_clocks {
                    4 => {
                        self.ly_to_compare = Some(self.ly);
                        self.check_ly_equals_lyc(ic);
                        if self.line == 144 {
                            ic.request_interrupt(InterruptBits::V_BLANK);
                            self.stat_update(ic, Mode::OamSearch);
                        }
                    }
                    TOTAL_LINE_CLOCKS => {
                        self.line_clocks = 0;
                        self.ly += 1;
                        self.line += 1;
                        self.ly_to_compare = None;
                        self.check_ly_equals_lyc(ic);
                    }
                    _ => {}
                }
                self.stat_update(ic, Mode::VBlank);
            }
            153 => match self.line_clocks {
                4 => {
                    self.ly_to_compare = Some(153);
                    self.check_ly_equals_lyc(ic);
                    self.ly = 0;
                }
                8 => {
                    self.ly_to_compare = None;
                    self.check_ly_equals_lyc(ic);
                }
                12 => {
                    self.ly_to_compare = Some(0);
                    self.check_ly_equals_lyc(ic);
                }
                TOTAL_LINE_CLOCKS => {
                    self.mode = Mode::OamSearch;
                    self.pending_mode = Some(Mode::OamSearch);
                    // Transition from the last line 153 to the line 0 goes like this:
                    // Cycle 456    line 153 => STAT mode=1
                    // Cycle 0      line   0 => STAT mode=0
                    // Cycle 4+     line   0 => STAT mode=2
                    // tested by ly00_mode0_2.gs
                    // https://github.com/AntonioND/giibiiadvance/blob/master/docs/TCAGBD.pdf section 8.9.1
                    self.change_stat_mode(Mode::HBlank);

                    if self.skip_frames > 0 {
                        self.skip_frames -= 1;
                    }
                    self.window_line = 0;
                    self.line = 0;
                    self.line_clocks = 0;
                }
                _ => {}
            },
            line => panic!("Processing line {} during vblank.", line),
        }
    }

    fn stat_update(&mut self, ic: &mut InterruptController, mode: Mode) {
        if !is_lcd_enabled(&self.lcdc) {
            return;
        }

        let mode_intr = match mode {
            Mode::OamSearch => self.stat.get_bits(StatBits::OAM_INTERRUPT),
            Mode::HBlank => self.stat.get_bits(StatBits::H_BLANK_INTERRUPT),
            Mode::VBlank => self.stat.get_bits(StatBits::V_BLANK_INTERRUPT),
            Mode::PixelTransfer => 0,
        };

        let ly_equals_ly_intr = self.stat.contains(StatBits::LYC_EQUALS_LY_FLAG)
            && self.stat.contains(StatBits::LYC_EQUALS_LY_INTERRUPT);

        let stat_flag = mode_intr > 0 || ly_equals_ly_intr;

        if !self.prev_stat_flag && stat_flag {
            ic.request_interrupt(InterruptBits::LCD_STATS);
        }
        self.prev_stat_flag = stat_flag;
    }

    fn check_ly_equals_lyc(&mut self, ic: &mut InterruptController) {
        if Some(self.lyc) == self.ly_to_compare {
            self.stat.set(StatBits::LYC_EQUALS_LY_FLAG, true);
        } else {
            self.stat.remove(StatBits::LYC_EQUALS_LY_FLAG);
        }
        self.stat_update(ic, self.stat_mode)
    }

    fn check_ly_equals_lyc_no_mode(&mut self, ic: &mut InterruptController) {
        if Some(self.lyc) == self.ly_to_compare {
            self.stat.set(StatBits::LYC_EQUALS_LY_FLAG, true);
        } else {
            self.stat.remove(StatBits::LYC_EQUALS_LY_FLAG);
        }
        // This is ugly hack, because this function is called when LCD is turned oo
        // and the mode can't be PixelTransfer so mode interrupt wont happend
        self.stat_update(ic, Mode::PixelTransfer)
    }

    fn init_pixel_transfer(&mut self) {
        self.x = 0;
        self.window_x = (self.wx as i32) - 7;
        self.dropped_pixels = 0;

        self.line_tiles.clear();

        // TODO check this
        self.sampled_scx = self.scx;

        let x = self.sampled_scx;
        let y = self.ly.wrapping_add(self.scy);
        self.fetcher.start(x, y, MapLayer::Background);
    }

    fn process_pixel_transfer(&mut self) {
        self.fetcher
            .tick(&self.vram, &self.lcdc, self.ly.wrapping_add(self.scy));

        if self.fetcher.len() <= 8 {
            return;
        }

        if is_background_or_window_enable(&self.lcdc) {
            // TODO check this - this might be true even if bg&win is disabled
            // discard pixels from tile that are not visible due to X scroll
            if self.dropped_pixels < self.sampled_scx % (TILE_SIZE as u8) {
                self.dropped_pixels += 1;
                self.fetcher.shift();
                return;
            }

            // WX is between <0,6> - discard previous fetched pixels
            // TODO WX=0 is probably broken somehow https://discord.com/channels/465585922579103744/465586075830845475/786173202211799051
            if self.fetcher.mode == MapLayer::Window && self.window_x < 0 {
                self.window_x += 1;
                self.fetcher.shift();
                return;
            }

            let wx = if self.wx <= 7 { 0 } else { self.wx - 7 };
            let is_window_possible = self.window_line_enabled && self.x == wx;
            if is_window_enabled(&self.lcdc)
                && is_window_possible
                && self.fetcher.mode != MapLayer::Window
            {
                let x = self.x.wrapping_sub(self.wx).wrapping_add(7);
                let y = self.window_line;
                self.window_line += 1;
                self.fetcher.start(x, y, MapLayer::Window);
                return;
            }
        }

        let fifo_item = self.fetcher.shift();
        let bg_layer_enabled = if self.is_cgb {
            true
        } else {
            is_background_or_window_enable(&self.lcdc)
        };
        if bg_layer_enabled {
            match fifo_item {
                Some(fifo_item) => {
                    let palette = if self.is_cgb {
                        self.bg_color_palettes.get_palette(fifo_item.palette)
                    } else {
                        &self.bgp_pal
                    };

                    let color = palette.colors[fifo_item.data as usize];
                    let priority = self.get_bg_tile_priority(&fifo_item);
                    self.line_tiles.insert(self.x, (fifo_item.data, priority));

                    self.render_pixel(&color);
                }
                None => panic!("Trying to pop pixels from empty FIFO."),
            }
        } else {
            // TODO is this true for CGB?
            let color = self.bgp_pal.colors[0];
            self.render_pixel(&color);
        }

        self.x += 1;
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

    fn render_pixel(&mut self, pixel: &Rgb) {
        self.screen_buffer.get_write_buffer_mut().set_pixel(
            self.x as usize,
            self.ly as usize,
            pixel,
        )
    }

    fn get_visible_sprites(&self) -> Vec<&Sprite> {
        let sprite_height = get_sprites_height(&self.lcdc) as isize;

        let current_line = self.ly as isize;
        let mut possible_sprites: Vec<&Sprite> = self
            .oam
            .sprites
            .iter()
            .filter(|sprite| sprite.y <= current_line && current_line < sprite.y + sprite_height)
            .collect();

        if !self.is_cgb || get_oam_priority(self.opri) == OamPriority::XPosition {
            possible_sprites.sort_by(|&a, &b| a.x.cmp(&b.x));
        }

        let mut visible_sprites: Vec<&Sprite> = possible_sprites.into_iter().take(10).collect();
        visible_sprites.reverse();

        visible_sprites
    }

    fn render_sprites(&mut self) {
        if !are_sprites_enabled(&self.lcdc) {
            return;
        }

        let sprites = self.get_visible_sprites();

        let pixels: Vec<(usize, usize, Rgb, bool)> = sprites
            .iter()
            .flat_map(|sprite| self.render_sprite(sprite))
            .collect();

        // TODO refactor this sh**
        for (x, y, pixel, is_above_bg) in pixels {
            if self.is_cgb {
                let obj_on_top = self.lcdc.bits() & 1 == 0;
                let bg_is_zero = self
                    .line_tiles
                    .get(&(x as u8))
                    .map_or(false, |pair| pair.0 == 0);
                let bg_has_priority = self
                    .line_tiles
                    .get(&(x as u8))
                    .map_or(false, |pair| pair.1 == BgToOamPriority::BgPriority);

                if obj_on_top || bg_is_zero || (is_above_bg && !bg_has_priority) {
                    self.screen_buffer
                        .get_write_buffer_mut()
                        .set_pixel(x, y, &pixel);
                }
            } else {
                if !is_above_bg {
                    let current_pixel = self.screen_buffer.get_write_buffer_mut().get_pixel(x, y);
                    if current_pixel != self.bgp_pal.colors[0] {
                        continue;
                    }
                }
                self.screen_buffer
                    .get_write_buffer_mut()
                    .set_pixel(x, y, &pixel);
            }
        }
    }

    fn render_sprite(&self, sprite: &Sprite) -> Vec<(usize, usize, Rgb, bool)> {
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

        let mut pixels = vec![];
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
        // ugly implementation taken from JS version
        let is_oam_search = self.stat_mode == Mode::OamSearch;
        let is_pixel_transfer = self.stat_mode == Mode::PixelTransfer;
        if access == Access::Read {
            if is_oam_search || is_pixel_transfer {
                return false;
            }

            if self.pending_mode == Some(Mode::OamSearch) {
                return false;
            }
        }

        let is_oam_accessed = is_oam_search && self.line_clocks <= 76;
        let is_used = is_oam_accessed || is_pixel_transfer;
        !is_used
    }

    fn can_access_vram(&self, access: Access) -> bool {
        if self.stat_mode == Mode::PixelTransfer {
            return false;
        }
        if access == Access::Read && self.stat_mode == Mode::OamSearch && self.line_clocks == 80 {
            return false;
        }
        true
    }
}

impl Ppu {
    pub fn get_screen_buffer(&self) -> &Buffer {
        &self.screen_buffer.get_read_buffer()
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
                        _ => panic!(get_invalid_address("PPU (read)", address)),
                    };
                }
                match address {
                    R_BGPI | R_BGPD | R_OBPI | R_OBPD | R_OPRI | R_VBK => 0xff,
                    _ => panic!(get_invalid_address("PPU (read)", address)),
                }
            }
        }
    }

    pub fn write_byte(&mut self, address: u16, value: u8, ic: &mut InterruptController) {
        match address {
            R_LCDC => {
                let was_enabled = is_lcd_enabled(&self.lcdc);
                self.lcdc = LcdcBits::from_bits_truncate(value);
                let is_enabled = is_lcd_enabled(&self.lcdc);
                // off - on
                if !was_enabled && is_enabled {
                    // OAM on the first line is skipped
                    // https://www.reddit.com/r/EmuDev/comments/6h2asw/stat_register_and_stat_interrupt_delay_in_dmgcgb/
                    self.change_stat_mode(Mode::HBlank);
                    self.mode = Mode::OamSearch;
                    self.pending_mode = None;

                    self.line_clocks = 4;
                    // Only LY=LYC can trigger STAT interrupt now
                    self.check_ly_equals_lyc_no_mode(ic);
                    // self.prev_stat_flag = false;
                    self.ly_to_compare = None;

                    // The first frame (after LCD is turned on) is skipped
                    self.skip_frames = 1;
                }

                // On -> off
                if was_enabled && !is_enabled {
                    self.ly = 0;
                    self.ly_to_compare = Some(0);
                    self.line = 0;
                    self.change_stat_mode(Mode::HBlank);
                    self.screen_buffer
                        .get_write_buffer_mut()
                        .clear_with(&self.system_palette.colors[0]);
                }
            }
            R_LY => {} // read-only
            R_LYC => {
                self.lyc = value;
                if is_lcd_enabled(&self.lcdc) {
                    self.check_ly_equals_lyc(ic);
                    self.stat_update(ic, self.stat_mode);
                }
            }
            R_STAT => {
                let mut new_stat = StatBits::from_bits_truncate(value);
                // LY=LYC is not writeable
                new_stat.remove(StatBits::LYC_EQUALS_LY_FLAG);
                self.stat = (self.stat & StatBits::LYC_EQUALS_LY_FLAG) | new_stat;

                if is_lcd_enabled(&self.lcdc)
                    && [Mode::HBlank, Mode::VBlank].contains(&self.stat_mode)
                {
                    self.stat_update(ic, self.stat_mode)
                }
            }
            R_SCX => self.scx = value,
            R_SCY => {
                // this should be immediately propagated to fetcher
                self.scy = value
            }
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
                        _ => panic!(get_invalid_address("PPU (write)", address)),
                    };
                }
                match address {
                    R_BGPI | R_BGPD | R_OBPI | R_OBPD | R_OPRI | R_VBK => {}
                    _ => panic!(get_invalid_address("PPU (write)", address)),
                }
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
