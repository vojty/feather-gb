#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Rgb {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

// https://github.com/mattcurrie/cgb-acid2#reference-image
fn convert_from_cgb(value: u8) -> u8 {
    value << 3 | value >> 2
}

impl Rgb {
    pub fn empty() -> Rgb {
        Rgb { r: 0, g: 0, b: 0 }
    }

    pub fn new(r: u8, g: u8, b: u8) -> Rgb {
        Rgb { r, g, b }
    }

    pub fn from_u16(data: u16) -> Rgb {
        let mask = 0b1_1111;
        let r = (data & mask) as u8; // bits 0-4
        let g = ((data >> 5) & mask) as u8; // bits 5-9
        let b = ((data >> 10) & mask) as u8; // bits 10-14
        Rgb {
            r: convert_from_cgb(r),
            g: convert_from_cgb(g),
            b: convert_from_cgb(b),
        }
    }
}

#[derive(Clone, Copy)]
pub struct Palette {
    pub colors: [Rgb; 4],
    pub bits: u8,
}

fn create_colors(bits: u8, system_palette: &DmgPalette) -> [Rgb; 4] {
    let bits = bits as usize;
    [
        system_palette.colors[(bits & 0b11)],
        system_palette.colors[(bits >> 2 & 0b11)],
        system_palette.colors[(bits >> 4 & 0b11)],
        system_palette.colors[(bits >> 6 & 0b11)],
    ]
}

impl Palette {
    pub fn from_bits(bits: u8, system_palette: &DmgPalette) -> Self {
        Self {
            bits,
            colors: create_colors(bits, system_palette),
        }
    }

    pub fn empty() -> Self {
        Self {
            bits: 0x00,
            colors: [Rgb::empty(); 4],
        }
    }

    pub fn change_system_palette(&mut self, system_palette: &DmgPalette) {
        self.colors = create_colors(self.bits, system_palette)
    }

    pub fn bits(&self) -> u8 {
        self.bits
    }
}

pub enum DmgPalettes {
    Gray,
    Green,
    GreenDmg,
}

pub struct DmgPalette {
    pub colors: [Rgb; 4],
}

impl DmgPalette {
    pub fn new(colors: [Rgb; 4]) -> Self {
        Self { colors }
    }
}

impl DmgPalettes {
    pub fn get_palette(&self) -> DmgPalette {
        match self {
            DmgPalettes::Gray => DmgPalette::new([
                Rgb::new(255, 255, 255),
                Rgb::new(192, 192, 192),
                Rgb::new(96, 96, 96),
                Rgb::new(0, 0, 0),
            ]),
            // Used in scribbltests
            DmgPalettes::Green => DmgPalette::new([
                Rgb::new(224, 248, 208),
                Rgb::new(136, 191, 112),
                Rgb::new(52, 104, 86),
                Rgb::new(9, 25, 33),
            ]),
            // https://www.designpieces.com/palette/game-boy-original-color-palette-hex-and-rgb/
            DmgPalettes::GreenDmg => DmgPalette::new([
                Rgb::new(155, 188, 15),
                Rgb::new(139, 172, 15),
                Rgb::new(48, 98, 48),
                Rgb::new(15, 56, 15),
            ]),
        }
    }
}

const MASK_INDEX: u8 = 0x3f;

pub struct ColorPaletteMemory {
    pub palettes: [Palette; 8],
    data: [u8; 64], // 8 palettes x 4 colors x 2 bytes
    index: u8,
    auto_increment: bool,
}

impl ColorPaletteMemory {
    pub fn new() -> Self {
        Self {
            palettes: [Palette::empty(); 8], // precomputed colors
            data: [0; 64],                   // 8 palettes x 4 colors x 2 bytes
            index: 0,
            auto_increment: false,
        }
    }

    pub fn get_palette(&self, index: u8) -> &Palette {
        &self.palettes[index as usize]
    }

    pub fn read_index(&self) -> u8 {
        let increment_bit = if self.auto_increment { 1 << 7 } else { 0 };
        increment_bit | self.index
    }

    pub fn write_index(&mut self, value: u8) {
        self.index = value & MASK_INDEX;
        self.auto_increment = (value >> 7) > 0;
    }

    pub fn read_data(&self) -> u8 {
        self.data[self.index as usize]
    }

    pub fn write_data(&mut self, value: u8) {
        self.data[self.index as usize] = value;
        // 0b0000_000X - color byte     (0-1) / 2 bytes per color
        // 0b0000_0XX0 - color index    (0-3) / 4 colors per palette
        // 0b00XX_X000 - palette index  (0-7) / 8 palettes

        let palette_index = ((self.index & 0b0011_1000) >> 3) as usize;
        let color_index = ((self.index & 0b0000_0110) >> 1) as usize;
        let base_index = (self.index & 0b1111_1110) as usize;

        let upper = (self.data[base_index + 1] as u16) << 8;
        let lower = self.data[base_index] as u16;
        let color16 = upper | lower;
        let rgb = Rgb::from_u16(color16);

        self.palettes[palette_index].colors[color_index] = rgb;

        if self.auto_increment {
            self.index = (self.index + 1) & 0x3f
        }
    }
}
