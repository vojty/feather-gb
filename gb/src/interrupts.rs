use bitflags::bitflags;

use crate::{traits::MemoryAccess, utils::get_invalid_address};

bitflags! {
    pub struct InterruptBits: u8 {
        const V_BLANK =   0b0000_0001;
        const LCD_STATS = 0b0000_0010;
        const TIMER =     0b0000_0100;
        const SERIAL =    0b0000_1000;
        const JOYPAD =    0b0001_0000;
    }
}

impl InterruptBits {
    fn get_address(self) -> u16 {
        match self {
            InterruptBits::V_BLANK => 0x0040,
            InterruptBits::LCD_STATS => 0x0048,
            InterruptBits::TIMER => 0x0050,
            InterruptBits::SERIAL => 0x0058,
            InterruptBits::JOYPAD => 0x0060,
            _ => 0x0000,
        }
    }
}

/**
 * Interrupt Flag (R/W)
 *
 * Bit 4: Transition from High to Low of Pin number P10-P13
 * Bit 3: Serial I/O transfer complete
 * Bit 2: Timer Overflow
 * Bit 1: LCDC (see STAT)
 * Bit 0: V-Blank
 */
const R_IF: u16 = 0xff0f;

/**
 * Interrupt Enable (R/W)
 *
 * Bit 4: Transition from High to Low of Pin number P10-P13
 * Bit 3: Serial I/O transfer complete
 * Bit 2: Timer Overflow
 * Bit 1: LCDC (see STAT)
 * Bit 0: V-Blank
 */
const R_IE: u16 = 0xffff;

pub struct InterruptController {
    /*
     * IF register
     * When bits are set, an interrupt has happened
     */
    interrupt_flag: InterruptBits,

    /*
     * IE register
     * When bits are set, the corresponding interrupt can be triggered
     */
    interrupt_enable: InterruptBits,
}

const INTERRUPTS_PRIORITY: [InterruptBits; 5] = [
    InterruptBits::V_BLANK,
    InterruptBits::LCD_STATS,
    InterruptBits::TIMER,
    InterruptBits::SERIAL,
    InterruptBits::JOYPAD,
];

impl InterruptController {
    pub fn new() -> InterruptController {
        InterruptController {
            interrupt_enable: InterruptBits::empty(),
            interrupt_flag: InterruptBits::empty(),
        }
    }

    pub fn init_without_bios(&mut self) {
        self.interrupt_flag = InterruptBits::from_bits_truncate(0xe1);
        self.interrupt_enable = InterruptBits::from_bits_truncate(0x00);
    }

    pub fn request_interrupt(&mut self, bit: InterruptBits) {
        self.interrupt_flag.insert(bit);
    }

    pub fn has_available_interrupts(&mut self) -> bool {
        !self.get_available_interrups().is_empty()
    }

    pub fn get_available_interrups(&mut self) -> InterruptBits {
        self.interrupt_flag & self.interrupt_enable
    }

    pub fn ack_interrupt(&mut self) -> u16 {
        let flags = self.get_available_interrups();
        let possible_interrupt = INTERRUPTS_PRIORITY
            .iter()
            .find(|&&interrupt| flags.contains(interrupt));

        match possible_interrupt {
            Some(interrupt) => {
                self.interrupt_flag.remove(*interrupt);

                interrupt.get_address()
            }
            None => 0x0000,
        }
    }
}

impl MemoryAccess for InterruptController {
    fn read_byte(&self, address: u16) -> u8 {
        match address {
            R_IE => self.interrupt_enable.bits(),
            R_IF => self.interrupt_flag.bits() | 0b1110_0000,
            _ => panic!(get_invalid_address("Interrupts (read)", address)),
        }
    }

    fn write_byte(&mut self, address: u16, value: u8) {
        match address {
            R_IE => self.interrupt_enable = InterruptBits::from_bits_truncate(value),
            R_IF => self.interrupt_flag = InterruptBits::from_bits_truncate(value),
            _ => panic!(get_invalid_address("Interrupts (write)", address)),
        }
    }
}
