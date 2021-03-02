use bitflags::bitflags;

bitflags! {
    pub struct LcdcBits: u8 {
        const LCD_ENABLED = 0b1000_0000;      // 7.
        const WIN_TILE_MAP = 0b0100_0000;     // 6.
        const WIN_ENABLED = 0b0010_0000;      // 5.
        const BG_WIN_TILE_DATA = 0b0001_0000; // 4.

        const BG_TILE_MAP = 0b0000_1000;      // 3.
        const OBJ_SIZE = 0b0000_0100;         // 2.
        const OBJ_ENABLED = 0b0000_0010;      // 1.
        const BG_WIN_ENABLED = 0b0000_0001;   // 0.
    }
}

// unused // 7.
bitflags! {
    pub struct StatBits: u8 {
        const LYC_EQUALS_LY_INTERRUPT   = 0b0100_0000; // 6.
        const OAM_INTERRUPT             = 0b0010_0000; // 5.
        const V_BLANK_INTERRUPT         = 0b0001_0000; // 4.

        const H_BLANK_INTERRUPT         = 0b0000_1000; // 3.
        const LYC_EQUALS_LY_FLAG        = 0b0000_0100; // 2.
    }
}
// const MODE                      = 0b0000_0011; // 0. - 1.

impl StatBits {
    pub fn get_bits(&self, bits: StatBits) -> u8 {
        if self.contains(bits) {
            return bits.bits();
        }
        0
    }
}

pub fn is_lcd_enabled(lcdc: &LcdcBits) -> bool {
    lcdc.contains(LcdcBits::LCD_ENABLED)
}

pub fn is_background_or_window_enable(lcdc: &LcdcBits) -> bool {
    lcdc.contains(LcdcBits::BG_WIN_ENABLED)
}

pub fn is_window_enabled(lcdc: &LcdcBits) -> bool {
    lcdc.contains(LcdcBits::WIN_ENABLED)
}

pub fn get_sprites_height(lcdc: &LcdcBits) -> usize {
    if lcdc.contains(LcdcBits::OBJ_SIZE) {
        16
    } else {
        8
    }
}

pub fn are_sprites_enabled(lcdc: &LcdcBits) -> bool {
    lcdc.contains(LcdcBits::OBJ_ENABLED)
}

pub fn get_background_tile_map_address(lcdc: &LcdcBits) -> u16 {
    let base_address = if lcdc.contains(LcdcBits::BG_TILE_MAP) {
        0x9c00
    } else {
        0x9800
    };
    base_address & 0x1fff
}

pub fn get_window_tile_map_address(lcdc: &LcdcBits) -> u16 {
    let base_address = if lcdc.contains(LcdcBits::WIN_TILE_MAP) {
        0x9c00
    } else {
        0x9800
    };
    base_address & 0x1fff
}

pub fn transform_tile_number(lcdc: &LcdcBits, tile_number: usize) -> usize {
    let unsigned = lcdc.contains(LcdcBits::BG_WIN_TILE_DATA);
    /*
     * 8000-87FF  Tile set #1: tiles 0-127
     * 8800-8FFF  Tile set #1: tiles 128-255
     *            Tile set #0: tiles -1 to -128
     * 9000-97FF  Tile set #0: tiles 0-127
     */

    // Tile set #1
    if unsigned {
        return tile_number;
    }

    // Tile set #0
    ((tile_number as i8 as i16) + 256) as usize
}
