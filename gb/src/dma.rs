const OAM_SIZE: u16 = 0xa0;
// Write in M-cycle N -> first byte is copied in N+2
const START_DELAY: u8 = 1;

struct Pending {
    source: u16,
    delay: u8,
}

struct Transfer {
    source: u16,
    offset: u16,
}

pub struct OamDma {
    register: u8,
    pending: Option<Pending>,
    transfer: Option<Transfer>,
}

impl OamDma {
    pub fn new() -> OamDma {
        OamDma {
            register: 0xff,
            pending: None,
            transfer: None,
        }
    }

    pub fn read_byte(&self) -> u8 {
        self.register
    }

    pub fn is_active(&self) -> bool {
        self.transfer.is_some()
    }

    pub fn request(&mut self, value: u8) {
        self.register = value;
        // On restart, the running transfer continues until the new one starts
        self.pending = Some(Pending {
            source: (value as u16) << 8,
            delay: START_DELAY,
        });
    }

    // Advances the transfer by one M-cycle, returns (source, target) of the byte to copy
    pub fn tick(&mut self) -> Option<(u16, u16)> {
        if let Some(pending) = &mut self.pending {
            if pending.delay == 0 {
                self.transfer = Some(Transfer {
                    source: pending.source,
                    offset: 0,
                });
                self.pending = None;
            } else {
                pending.delay -= 1;
            }
        }

        let transfer = self.transfer.as_mut()?;

        // OAM stays blocked for one more M-cycle after the last byte
        if transfer.offset == OAM_SIZE {
            self.transfer = None;
            return None;
        }

        // 0xfe00 -> 0xffff range cannot be accessed by DMA and is mapped to WRAM
        let source = match transfer.source + transfer.offset {
            address @ 0xfe00.. => address - 0x2000,
            address => address,
        };
        let target = 0xfe00 | transfer.offset;
        transfer.offset += 1;

        Some((source, target))
    }
}
