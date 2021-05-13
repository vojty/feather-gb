/**
 * LCD Control (R/W)
 *
 * Bit 7 - LCD Control Operation *
 *    0: Stop completely (no picture on screen)
 *    1: operation
 * Bit 6 - Window Tile Map Display Select
 *    0: $9800-$9BFF
 *    1: $9C00-$9FFF
 * Bit 5 - Window Display
 *    0: off
 *    1: on
 * Bit 4 - BG & Window Tile Data Select
 *    0: $8800-$97FF
 *    1: $8000-$8FFF <- Same area as OBJ
 * Bit 3 - BG Tile Map Display Select
 *    0: $9800-$9BFF
 *    1: $9C00-$9FFF
 * Bit 2 - OBJ (Sprite) Size
 *    0: 8*8
 *    1: 8*16 (width*height)
 * Bit 1 - OBJ (Sprite) Display
 *    0: off
 *    1: on
 * Bit 0 - BG & Window Display
 *    0: off
 *    1: on
 *
 * Stopping LCD operation (bit 7 from 1 to 0) must be performed
 * during V-blank to work properly. V-blank can be confirmed
 * when the value of LY is greater than or equal to 144.
 */
pub const R_LCDC: u16 = 0xff40;

/**
 *  LCDC Status (R/W)
 *  Bit 7 - Unused
 *  Bit 6 - LYC=LY Coincidence Interrupt (1=Enable) (Read/Write)
 *  Bit 5 - Mode 2 OAM Interrupt         (1=Enable) (Read/Write)
 *  Bit 4 - Mode 1 V-Blank Interrupt     (1=Enable) (Read/Write)
 *  Bit 3 - Mode 0 H-Blank Interrupt     (1=Enable) (Read/Write)
 *  Bit 2 - Coincidence Flag  (0:LYC<>LY, 1:LYC=LY) (Read Only)
 *  Bit 1-0 - Mode Flag       (Mode 0-3, see below) (Read Only)
 *         0: During H-Blank
 *         1: During V-Blank
 *         2: During Searching OAM
 *         3: During Transferring Data to LCD Driver
 */
pub const R_STAT: u16 = 0xff41;

/**
 * Scroll Y (R/W)
 *
 * 8 Bit value $00-$FF to scroll BG Y screen position.
 */
pub const R_SCY: u16 = 0xff42;

/**
 *  Scroll X (R/W)
 *
 * 8 Bit value $00-$FF to scroll BG X screen position.
 */
pub const R_SCX: u16 = 0xff43;

/**
 * LCDC Y-Coordinate (R)
 *
 * The LY indicates the vertical line to which
 * the present data is transferred to the LCD
 * Driver. The LY can take on any value
 * between 0 through 153. The values between
 * 144 and 153 indicate the V-Blank period.
 * Writing will reset the counter.
 */
pub const R_LY: u16 = 0xff44;

/**
 * LY Compare (R/W)
 *
 * The LYC compares itself with the LY. If the
 * values are the same it causes the STAT to
 * set the coincident flag.
 */
pub const R_LYC: u16 = 0xff45;

/**
 * DMA Transfer and Start Address (W)
 *
 * The DMA Transfer (40*28 bit) from internal ROM or
 * RAM ($0000-$F19F) to the OAM (address $FE00-$FE9F)
 *
 * 40 sprites, 4 clocks per sprite = 160 clocks
 * 160 clocks = 40 sprites
 */
// pub const R_DMA: u16 = 0xff46;

/**
 *  BG & Window Palette Data (R/W)
 *    Bit 7-6 - Data for Dot Data 11 - (Normally darkest color)
 *    Bit 5-4 - Data for Dot Data 10
 *    Bit 3-2 - Data for Dot Data 01
 *    Bit 1-0 - Data for Dot Data 00 - (Normally lightest color)
 *
 * This selects the shade of grays to use
 * for the background (BG) & window pixels.
 * Since each pixel uses 2 bits, the
 * corresponding shade will be selected from here.
 */
pub const R_BGP: u16 = 0xff47;

pub const R_OBP0: u16 = 0xff48;
pub const R_OBP1: u16 = 0xff49;

/**
 * Window Y Position (R/W)
 *
 * 0 <= WY <= 143
 * WY must be greater than or equal to 0 and
 * must be less than or eq
 */
pub const R_WY: u16 = 0xff4a;
pub const R_WX: u16 = 0xff4b;

/**
 * CGB Mode Only - VRAM Bank (R/W)
 *
 * This register can be written to to change VRAM banks. Only bit 0 matters, all other bits are ignored.
 */
pub const R_VBK: u16 = 0xff4f;

/**
 * CGB Mode Only - Object Priority Mode
 *
 * This register serves as a flag for which object priority mode to use. While the DMG prioritizes objects by x-coordinate,
 * the CGB prioritizes them by location in OAM. This flag is set by the CGB bios after checking the game's CGB compatibility.
 *
 * Bit 0: OBJ Priority Mode (0=OAM Priority, 1=Coordinate Priority) (Read/Write)
 */
pub const R_OPRI: u16 = 0xff6c;
