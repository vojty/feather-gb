use crate::traits::DisplayHex;
use parse_display::Display;

use super::{
    mbc1::Mbc1, mbc2::Mbc2, mbc3::Mbc3, mbc5::Mbc5, rom_only::RomOnly, RAM_BANK_SIZE, ROM_BANK_SIZE,
};
use crate::cartridges::Controller;

#[derive(Display)]
pub enum CartridgeType {
    RomOnly,
    Mbc1,
    Mbc1Ram,
    Mbc1RamBattery,
    Mbc2,
    Mbc2Battery,
    Mbc3,
    Mbc3Ram,
    Mbc3RamBattery,
    Mbc3TimerBattery,
    Mbc3TimerRamBattery,
    Mbc5,
    Mbc5Ram,
    Mbc5RamBattery,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Display)]
pub enum CGBFlag {
    None,
    Supported,
    Required,
}

pub struct Meta {
    pub cartridge_type: CartridgeType,
    pub cartridge_type_byte: u8,
    pub name: String,
    pub rom_size: usize,
    pub ram_size: usize,
    pub cgb_flag: CGBFlag,
}

impl Meta {
    pub fn get_name(&self) -> &str {
        let name = self.name.trim();
        if !name.is_empty() {
            return name;
        }
        "<empty-name>"
    }
}

pub struct Cartridge {
    pub meta: Meta,
    controller: Box<dyn Controller>,
}

fn get_cartridge_type(type_byte: u8) -> CartridgeType {
    match type_byte {
        0x00 => CartridgeType::RomOnly,
        0x01 => CartridgeType::Mbc1,
        0x02 => CartridgeType::Mbc1Ram,
        0x03 => CartridgeType::Mbc1RamBattery,
        0x05 => CartridgeType::Mbc2,
        0x06 => CartridgeType::Mbc2Battery,
        0x0f => CartridgeType::Mbc3TimerBattery,
        0x10 => CartridgeType::Mbc3TimerRamBattery,
        0x11 => CartridgeType::Mbc3,
        0x12 => CartridgeType::Mbc3Ram,
        0x13 => CartridgeType::Mbc3RamBattery,
        0x19 => CartridgeType::Mbc5,
        0x1a => CartridgeType::Mbc5Ram,
        0x1b => CartridgeType::Mbc5RamBattery,
        unknown => panic!("Unknown cartridge type {}", unknown.to_hex()),
    }
}

///
/// Data - holds ROM & RAM
/// Controller - specific registers for MBC
///
/// Read/Write
///  Catridge -> Controller -> Data
///
impl Cartridge {
    pub fn empty() -> Cartridge {
        let rom = Box::new([0xff; ROM_BANK_SIZE]);
        let rom_size = rom.len();
        let data = Data::new(rom, Box::new([]), rom_size, 0);
        Cartridge {
            controller: Box::new(RomOnly::new(data)),
            meta: Meta {
                cartridge_type: CartridgeType::RomOnly,
                cartridge_type_byte: 0,
                name: String::from("empty"),
                ram_size: 0,
                rom_size,
                cgb_flag: CGBFlag::None,
            },
        }
    }

    pub fn from_bytes(binary: Vec<u8>) -> Cartridge {
        let rom = binary.into_boxed_slice();

        let cartridge_type_byte = rom[0x0147];
        let cartridge_type = get_cartridge_type(cartridge_type_byte);

        let rom_size = match rom[0x0148] {
            0x00 => 2 * ROM_BANK_SIZE,   //  32KB (no ROM banking)
            0x01 => 4 * ROM_BANK_SIZE,   //  64KB (4 banks)
            0x02 => 8 * ROM_BANK_SIZE,   // 128KB (8 banks)
            0x03 => 16 * ROM_BANK_SIZE,  // 256KB (16 banks)
            0x04 => 32 * ROM_BANK_SIZE,  // 512KB (32 banks)
            0x05 => 64 * ROM_BANK_SIZE,  //   1MB (64 banks)  - only 63 banks used by MBC1
            0x06 => 128 * ROM_BANK_SIZE, //   2MB (128 banks) - only 125 banks used by MBC1
            0x07 => 256 * ROM_BANK_SIZE, //   4MB (256 banks)
            0x08 => 512 * ROM_BANK_SIZE, //   8MB (512 banks)
            unknown => panic!("Unknown ROM size, value = {}", unknown.to_hex()),
        };

        let ram_size = match cartridge_type {
            // MBC2 has fixed internal RAM 512 x 4bits
            CartridgeType::Mbc2 | CartridgeType::Mbc2Battery => 512,
            _ => match rom[0x0149] {
                0x00 => 0,
                0x01 => 2048,
                0x02 => RAM_BANK_SIZE,      //   8_192
                0x03 => 4 * RAM_BANK_SIZE,  //  32_768
                0x04 => 16 * RAM_BANK_SIZE, // 131_072
                0x05 => 8 * RAM_BANK_SIZE,  //  65_536
                unknown => panic!("Unknown RAM size, value = {}", unknown.to_hex()),
            },
        };

        let ram = vec![0xff; ram_size].into_boxed_slice();

        let cgb_flag = match &rom[0x143] {
            0x80 => CGBFlag::Supported,
            0xC0 => CGBFlag::Required,
            _ => CGBFlag::None,
        };

        let s = &rom[0x0134..0x0143];
        let name = s.iter().map(|byte| *byte as char).collect::<String>();
        let data = Data::new(rom, ram, rom_size, ram_size);
        let controller: Box<dyn Controller> = match cartridge_type {
            CartridgeType::RomOnly => Box::new(RomOnly::new(data)),
            CartridgeType::Mbc1 | CartridgeType::Mbc1Ram | CartridgeType::Mbc1RamBattery => {
                Box::new(Mbc1::new(data))
            }
            CartridgeType::Mbc2 | CartridgeType::Mbc2Battery => Box::new(Mbc2::new(data)),
            CartridgeType::Mbc3TimerBattery
            | CartridgeType::Mbc3TimerRamBattery
            | CartridgeType::Mbc3
            | CartridgeType::Mbc3Ram
            | CartridgeType::Mbc3RamBattery => Box::new(Mbc3::new(data)),
            CartridgeType::Mbc5 | CartridgeType::Mbc5Ram | CartridgeType::Mbc5RamBattery => {
                Box::new(Mbc5::new(data))
            }
        };

        let meta = Meta {
            cartridge_type,
            cartridge_type_byte,
            name,
            rom_size,
            ram_size,
            cgb_flag,
        };

        Cartridge { meta, controller }
    }

    pub fn read_byte(&self, address: u16) -> u8 {
        self.controller.read_byte(address)
    }

    pub fn write_byte(&mut self, address: u16, value: u8) {
        self.controller.write_byte(address, value)
    }
}

pub struct Data {
    rom: Box<[u8]>,
    ram: Box<[u8]>,

    rom_size: usize,
    ram_size: usize,
}

impl Data {
    pub fn new(rom: Box<[u8]>, ram: Box<[u8]>, rom_size: usize, ram_size: usize) -> Self {
        Self {
            rom,
            ram,
            rom_size,
            ram_size,
        }
    }

    pub fn get_rom_address(&self, addr: u16, bank: usize) -> usize {
        let offset = bank * ROM_BANK_SIZE;
        let real_address = (addr & 0x3fff) as usize + offset;
        real_address & (self.rom_size - 1)
    }

    pub fn get_ram_address(&self, addr: u16, bank: usize) -> usize {
        let offset = bank * RAM_BANK_SIZE;
        let real_address = (addr & 0x1fff) as usize + offset;
        real_address & (self.ram_size - 1)
    }

    pub fn get_ram_size(&self) -> usize {
        self.ram_size
    }

    pub fn read_rom(&self, address: usize) -> u8 {
        if address >= self.rom_size {
            return 0xff;
        }
        self.rom[address]
    }

    pub fn read_ram(&self, address: usize) -> u8 {
        if address >= self.ram_size {
            return 0xff;
        }
        self.ram[address]
    }

    pub fn write_ram(&mut self, address: usize, value: u8) {
        self.ram[address] = value;
    }
}
