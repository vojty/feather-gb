#[derive(PartialEq)]
enum State {
    IDLE,
    REQUESTED,
    TRIGGERED,
    ACTIVE,
}
pub struct OamDma {
    state: State,
    transfer_from_addr: u16,
    last_written: u8,
    offset: u16,
    requested: Option<u8>,
}

impl OamDma {
    pub fn new() -> OamDma {
        OamDma {
            state: State::IDLE,
            last_written: 0xff,
            transfer_from_addr: 0,
            offset: 0,
            requested: None,
        }
    }

    pub fn read_byte(&self) -> u8 {
        self.last_written
    }

    pub fn is_active(&self) -> bool {
        if [State::ACTIVE].contains(&self.state) {
            return true;
        }
        false
    }

    pub fn request(&mut self, value: u8) {
        self.last_written = value;

        self.requested = Some(value);
        if self.state == State::IDLE {
            self.state = State::REQUESTED;
        }
    }

    fn get_source_addr(&self) -> u16 {
        // 0xfe00 -> 0xffff cannot be accessed by DMA and are mapped to work RAM
        if 0xfe00 <= self.transfer_from_addr {
            return self.transfer_from_addr - 0x2000;
        }
        self.transfer_from_addr
    }

    pub fn tick(&mut self) -> Option<(u16, u16)> {
        if self.state == State::IDLE {
            return None;
        }

        // Request write + tick is same M cycle
        // One cycle delay before start
        if self.state == State::REQUESTED {
            self.state = State::TRIGGERED;
            self.transfer_from_addr = (self.last_written as u16) << 8;
            self.requested = None;
            self.offset = 0;
            return None;
        }

        if self.state == State::TRIGGERED {
            self.state = State::ACTIVE;
        }

        // One cycle delay before end
        if self.offset == 160 {
            self.state = State::IDLE;
            return None;
        }

        let source = self.get_source_addr();
        let target = self.offset | 0xfe00;
        self.transfer_from_addr += 1;
        self.offset += 1;

        // DMA is active, but restart occured -> previous DMA proceeds during 1
        if self.requested.is_some() {
            self.transfer_from_addr = (self.last_written as u16) << 8;
            self.requested = None;
            self.offset = 0;
        }

        Some((source, target))
    }
}
