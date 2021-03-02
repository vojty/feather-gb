<center>
<h1>FeatherGB</h1>
Just another GameBoy emulator written in Rust 🦀.

![Debugger](./browser/assets/images/screen.png)

</center>

## Modes

The emulator can be run in 2 modes - the normal mode (shows just GameBoy's display) and the debugger mode (using amazing [egui](https://github.com/emilk/egui)). Both are available for the desktop and the browser.

### Desktop

- Standard - **WIP** SDL2 (should be cross platform, but I've tested only MacOS)
- Debugger - egui (glium)

### Browser

Based on React & TypeScript in general

- Standard - **WIP** pure WebAssembly with some stylesheets
- Debugger - WebAssembly with egui

## Test results

| Suite           | Results                                       |
| --------------- | --------------------------------------------- |
| Mooneye's tests | [results](./docs/results/results-mooneyes.md) |

## TODOs

- make PPU more accurate and pass some [mealybug-tearoom-tests](https://github.com/mattcurrie/mealybug-tearoom-tests)
- APU (currently with no sound)

## Project structure

- `/gb` - GB emulator core (Rust)
- `/debugger` - debugger core with egui (Rust)
- `/desktop` - desktop version of debugger using glium (Rust)
- `/debugger-web` - browser version of debugger using wasm (Rust)
- `/browser` - frontend SPA
- `/integration-tests` - ROM tests
