use constants::DISPLAY_WIDTH;
use parse_display::Display;

use crate::{
    constants::{self, TILE_SIZE},
    interrupts::{InterruptBits, InterruptController},
    traits::MemoryAccess,
    utils::get_invalid_address,
};

use super::{
    fetcher::Fetcher,
    oam::{Oam, Sprite, OAM_END, OAM_START},
    screen_buffer::{Buffer, ScreenBuffer},
    utils::{
        are_sprites_enabled, get_background_tile_map_address, get_sprites_height,
        get_window_tile_map_address, is_background_or_window_enable, is_lcd_enabled,
        is_window_enabled, transform_tile_number, LcdcBits, StatBits,
    },
    vram::{Tile, Vram, VRAM_END, VRAM_START},
};

use super::registers::{
    R_BGP, R_LCDC, R_LY, R_LYC, R_OBP0, R_OBP1, R_SCX, R_SCY, R_STAT, R_WX, R_WY,
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

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct RGB {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl RGB {
    pub fn to_array(&self) -> [u8; 3] {
        [self.r, self.g, self.b]
    }

    pub fn empty() -> RGB {
        RGB { r: 0, g: 0, b: 0 }
    }

    pub fn new(r: u8, g: u8, b: u8) -> RGB {
        RGB { r, g, b }
    }
}

pub type Palette = [RGB; 4];
pub enum Palettes {
    Gray,
    Green,
    GreenDmg,
}

impl Palettes {
    fn get_palette(&self) -> Palette {
        match self {
            Palettes::Gray => [
                RGB::new(255, 255, 255),
                RGB::new(192, 192, 192),
                RGB::new(96, 96, 96),
                RGB::new(0, 0, 0),
            ],
            // Used in scribbltests
            Palettes::Green => [
                RGB::new(224, 248, 208),
                RGB::new(136, 191, 112),
                RGB::new(52, 104, 86),
                RGB::new(9, 25, 33),
            ],
            // https://www.designpieces.com/palette/game-boy-original-color-palette-hex-and-rgb/
            Palettes::GreenDmg => [
                RGB::new(155, 188, 15),
                RGB::new(139, 172, 15),
                RGB::new(48, 98, 48),
                RGB::new(15, 56, 15),
            ],
        }
    }
}

#[derive(Clone, Copy, PartialEq, Debug, Display)]
pub enum Mode {
    HBlank, // 0
    VBlank, // 1
    OamSearch,
    PixelTransfer,
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
    bgp: u8,
    obp0: u8,
    obp1: u8,

    // internals
    pub ly_to_compare: Option<u8>,
    window_line: u8,
    window_line_enabled: bool,
    window_x: i32,
    x: u8,
    sampled_scx: u8,
    prev_stat_flag: bool,
    pub line_clocks: u32,
    pub mode: Mode,
    pub line: u8,
    dropped_pixels: u8,
    pending_mode: Option<Mode>,
    skip_frames: u32,
    system_palette: Palette,

    screen_buffer: ScreenBuffer,

    fetcher: Fetcher,

    // RAM
    pub vram: Vram,
    pub oam: Oam,
}

impl Ppu {
    pub fn new() -> Ppu {
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
            bgp: 0,
            obp0: 0,
            obp1: 0,

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
            system_palette: Palettes::Gray.get_palette(),

            dropped_pixels: 0,

            screen_buffer: ScreenBuffer::new(),
            fetcher: Fetcher::new(),

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
        self.bgp = 0xfc;
        self.obp0 = 0xff;
        self.obp1 = 0xff;
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
            // There is no delay for line to compare at line 0
            0 => {
                if self.line > 0 {
                    self.ly_to_compare = None;
                } else {
                    self.ly_to_compare = Some(0);
                }
            }
            // Line to compare is 4 cycles late
            4 => {
                self.ly_to_compare = Some(self.ly);
                self.check_ly_equals_lyc(ic); // TODO lyc=ly should not be checked at 0 line?
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
                    self.stat.remove(StatBits::LYC_EQUALS_LY_FLAG);

                    match self.ly {
                        0..=143 => {
                            self.mode = Mode::OamSearch;
                            self.pending_mode = Some(Mode::OamSearch);
                        }
                        144 => {
                            self.mode = Mode::VBlank;
                            self.pending_mode = Some(Mode::VBlank);
                            self.window_line_enabled = false;

                            self.screen_buffer.commit_frame();

                            if self.skip_frames == 0 {
                                // TODO enable drawing here
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
                    0 => {
                        self.ly_to_compare = None;
                        self.check_ly_equals_lyc(ic);
                    }
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
                0 => {
                    self.ly_to_compare = None;
                    self.check_ly_equals_lyc(ic);
                }
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
                    // Cycle 0      line 0 => STAT mode=0
                    // Cycle 4+     line 0 => STAT mode=2
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

        let pixel = self.fetcher.shift();
        if is_background_or_window_enable(&self.lcdc) {
            match pixel {
                Some(pixel) => {
                    let palette = self.get_palette(self.bgp);
                    let color = palette[pixel as usize];
                    self.render_pixel(color);
                }
                None => panic!("Trying to pop pixels from empty FIFO."),
            }
        } else {
            let palette = self.get_palette(self.bgp);
            self.render_pixel(palette[0]);
        }

        self.x += 1;
    }

    fn get_palette(&self, palette_register: u8) -> Palette {
        let reg = palette_register as usize;
        [
            self.system_palette[(reg & 0b11)],
            self.system_palette[(reg >> 2 & 0b11)],
            self.system_palette[(reg >> 4 & 0b11)],
            self.system_palette[(reg >> 6 & 0b11)],
        ]
    }

    fn render_pixel(&mut self, pixel: RGB) {
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
        possible_sprites.sort_by(|&a, &b| a.x.cmp(&b.x));

        let mut visible_sprites: Vec<&Sprite> = possible_sprites.into_iter().take(10).collect();
        visible_sprites.reverse();

        visible_sprites
    }

    fn render_sprites(&mut self) {
        if !are_sprites_enabled(&self.lcdc) {
            return;
        }

        let sprites = self.get_visible_sprites();

        let pixels: Vec<(usize, usize, RGB, bool)> = sprites
            .iter()
            .flat_map(|sprite| self.render_sprite(sprite))
            .collect();

        for (x, y, pixel, is_above_bg) in pixels {
            if !is_above_bg {
                let bg_pal = self.get_palette(self.bgp);
                let current_pixel = self.screen_buffer.get_write_buffer_mut().get_pixel(x, y);

                if current_pixel != bg_pal[0] {
                    continue;
                }
            }
            self.screen_buffer
                .get_write_buffer_mut()
                .set_pixel(x, y, pixel);
        }
    }

    fn render_sprite(&self, sprite: &Sprite) -> Vec<(usize, usize, RGB, bool)> {
        let sprite_height = get_sprites_height(&self.lcdc) as isize;
        let palette_register = if sprite.palette == 0 {
            self.obp0
        } else {
            self.obp1
        };
        let palette = self.get_palette(palette_register);
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

            let tile = &self.vram.tiles[tile_number + extra_offset];
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

            let color = palette[pixel as usize];
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
            R_BGP => self.bgp,
            R_WX => self.wx,
            R_WY => self.wy,
            R_OBP0 => self.obp0,
            R_OBP1 => self.obp1,

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
            _ => panic!(get_invalid_address("PPU (read)", address)),
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
                    self.prev_stat_flag = false;
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
                        .clear_with(self.system_palette[0]);
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
            R_BGP => self.bgp = value,
            R_WX => self.wx = value,
            R_WY => self.wy = value,
            R_OBP0 => self.obp0 = value,
            R_OBP1 => self.obp1 = value,

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
            _ => panic!(get_invalid_address("PPU (write)", address)),
        }
    }
}

// Debug info
impl Ppu {
    pub fn set_system_palette(&mut self, palette: Palettes) {
        self.system_palette = palette.get_palette();
    }

    pub fn get_tile(&self, index: usize, layer: MapLayer) -> &Tile {
        let base_address = match layer {
            MapLayer::Background => get_background_tile_map_address(&self.lcdc),
            MapLayer::Window => get_window_tile_map_address(&self.lcdc),
        } as usize;

        let n = self.vram.memory[base_address + index] as usize;
        let tile_number = transform_tile_number(&self.lcdc, n);

        &self.vram.tiles[tile_number]
    }

    pub fn get_backround_palette(&self) -> Palette {
        self.get_palette(self.bgp)
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
