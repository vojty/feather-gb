// Channel 1
/**
 * FF10 - NR10 - Channel 1 Sweep register (R/W)
 */
pub const R_NR10: u16 = 0xff10;

/**
 * FF11 - NR11 - Channel 1 Sound length/Wave pattern duty (R/W)
 */
pub const R_NR11: u16 = 0xff11;

/**
 * FF12 - NR12 - Channel 1 Volume Envelope (R/W)
 */
pub const R_NR12: u16 = 0xff12;

/**
 * FF13 - NR13 - Channel 1 Frequency lo (Write Only)
 */
pub const R_NR13: u16 = 0xff13;

/**
 * FF14 - NR14 - Channel 1 Frequency hi (R/W)
 */
pub const R_NR14: u16 = 0xff14;

// Channel 2
/**
 * FF16 - NR21 - Channel 2 Sound Length/Wave Pattern Duty (R/W)
 */
pub const R_NR21: u16 = 0xff16;

/**
 * FF17 - NR22 - Channel 2 Volume Envelope (R/W)
 */
pub const R_NR22: u16 = 0xff17;

/**
 * FF18 - NR23 - Channel 2 Frequency lo data (W)
 */
pub const R_NR23: u16 = 0xff18;

/**
 * FF19 - NR24 - Channel 2 Frequency hi data (R/W)
 */
pub const R_NR24: u16 = 0xff19;

// Channel 3
/**
 * FF1A - NR30 - Channel 3 Sound on/off (R/W)
 */
pub const R_NR30: u16 = 0xff1a;

/**
 * FF1B - NR31 - Channel 3 Sound Length
 */
pub const R_NR31: u16 = 0xff1b;

/**
 * FF1C - NR32 - Channel 3 Select output level (R/W)
 */
pub const R_NR32: u16 = 0xff1c;

/**
 * FF1D - NR33 - Channel 3 Frequency's lower data (W)
 */
pub const R_NR33: u16 = 0xff1d;

/**
 * FF1E - NR34 - Channel 3 Frequency's higher data (R/W)
 */
pub const R_NR34: u16 = 0xff1e;

// Channel 4
/**
 * FF20 - NR41 - Channel 4 Sound Length (R/W)
 */
pub const R_NR41: u16 = 0xff20;
/**
 * FF21 - NR42 - Channel 4 Volume Envelope (R/W)
 */
pub const R_NR42: u16 = 0xff21;
/**
 * FF22 - NR43 - Channel 4 Polynomial Counter (R/W)
 */
pub const R_NR43: u16 = 0xff22;
/**
 * FF23 - NR44 - Channel 4 Counter/consecutive; Inital (R/W)
 */
pub const R_NR44: u16 = 0xff23;
/**
 * FF24 - NR50 - Channel control / ON-OFF / Volume (R/W)
 *
 * Bit 7   - Output Vin to SO2 terminal (1=Enable)
 * Bit 6-4 - SO2 output level (volume)  (0-7)
 * Bit 3   - Output Vin to SO1 terminal (1=Enable)
 * Bit 2-0 - SO1 output level (volume)  (0-7)
 */
pub const R_NR50: u16 = 0xff24;

/**
 * FF25 - NR51 - Selection of Sound output terminal (R/W)
 *
 * Bit 7 - Output sound 4 to SO2 terminal
 * Bit 6 - Output sound 3 to SO2 terminal
 * Bit 5 - Output sound 2 to SO2 terminal
 * Bit 4 - Output sound 1 to SO2 terminal
 * Bit 3 - Output sound 4 to SO1 terminal
 * Bit 2 - Output sound 3 to SO1 terminal
 * Bit 1 - Output sound 2 to SO1 terminal
 * Bit 0 - Output sound 1 to SO1 terminal
 */
pub const R_NR51: u16 = 0xff25;

/**
 * FF26 - NR52 - Sound on/off
 *
 * Bit 7 - All sound on/off  (0: stop all sound circuits) (Read/Write)
 * Bit 3 - Sound 4 ON flag (Read Only)
 * Bit 2 - Sound 3 ON flag (Read Only)
 * Bit 1 - Sound 2 ON flag (Read Only)
 * Bit 0 - Sound 1 ON flag (Read Only)
 */
pub const R_NR52: u16 = 0xff26;
