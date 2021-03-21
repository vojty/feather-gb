<div align="center">
    <h1>FeatherGB</h1>
    Just another GameBoy emulator written in Rust 🦀.

    ![Debugger](./browser/assets/images/screen.png)

</div>

## Info

This is my first project in Rust, so many patterns might not be ideal. I also wanted to try WebAssembly a little bit.
The browser part is kinda hackish because I didn't intent to spent a lot of time styling/configuring webpack/improving UI. This might change in the future if the emulator is accurate "enough".

## Test results

The emulator is tested against popular test suites such as [blargg's test](https://github.com/retrio/gb-test-roms), [mooneye's tests](https://github.com/Gekkio/mooneye-gb/) etc.
These test suites are linked as git submodules (see `.gitmodules` file for details).

Generated test report is [here](./docs/results/results.md)

## Modes

The emulator can be run in 2 modes - the normal mode (shows just GameBoy's display) and the debugger mode (using amazing [egui](https://github.com/emilk/egui)). Both are available for the desktop and the browser.

### Desktop

- Standard - **WIP** rendered by SDL2 (should be cross platform, but I've tested only MacOS)
- Debugger - rendered by egui (using glium as backend)

### Browser

Based on React & TypeScript in general

- Standard - **WIP** WebAssembly with some stylesheets
- Debugger - WebAssembly with egui (using webgl as backend)

## TODOs

No specific priority here

- standard (play) mode
  - controls
  - gamepad
  - custom controls
- APU (currently with no sound - WIP in the previous TypeScript only version of the emulator)
- FIFO for sprites
- make PPU more accurate and pass some [mealybug-tearoom-tests](https://github.com/mattcurrie/mealybug-tearoom-tests)
- GameBoy Color support

## Project structure

- `/gb` - GB emulator core (Rust)
- `/debugger` - debugger core with egui (Rust)
- `/desktop` - desktop version of debugger using glium (Rust)
- `/debugger-web` - browser version of debugger using wasm (Rust)
- `/browser` - frontend SPA
- `/integration-tests` - ROM tests

## Resources

### Fonts

- Nintendo - Pretendo - https://fontmeme.com/fonts/pretendo-font/
- GameBoy - Gill Sans - https://www.myfonts.com/fonts/mti/gill-sans/
- DMG Buttons - NES Controller - https://www.deviantart.com/mrshrike/art/NES-Console-Controller-Font-141383845

### Images

- Feather icon - https://iconape.com/cape-feather-super-mario-world-logo-logo-icon-svg-png.html
- Gameboy icon - https://graphicburger.com/80s-gadgets-40-free-icons/
