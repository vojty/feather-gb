#!/bin/bash
set -eu

echo "DEPRECATED - see content for setup";
exit 1;

# ./setup_web.sh # <- call this first!

DIR=`(cd "$(dirname -- "$0")" && pwd -P)`

# FOLDER_NAME=${PWD##*/}
CRATE_NAME="debugger-web" # assume crate name is the same as the folder name
CRATE_NAME_SNAKE_CASE="${CRATE_NAME//-/_}" # for those who name crates with-kebab-case

# This is required to enable the web_sys clipboard API which egui_web uses
# https://rustwasm.github.io/wasm-bindgen/api/web_sys/struct.Clipboard.html
# https://rustwasm.github.io/docs/wasm-bindgen/web-sys/unstable-apis.html
export RUSTFLAGS=--cfg=web_sys_unstable_apis

# Clear output from old stuff:
rm -f docs/${CRATE_NAME_SNAKE_CASE}_bg.wasm

echo "Building rust…"
BUILD=release
cargo build --release -p ${CRATE_NAME} --lib --target wasm32-unknown-unknown

echo "Generating JS bindings for wasm…"
TARGET_NAME="${CRATE_NAME_SNAKE_CASE}.wasm"

WASM_FILE="./target/wasm32-unknown-unknown/$BUILD/$TARGET_NAME"

wasm-bindgen "$WASM_FILE" --out-dir docs --no-modules

echo "Finished: docs/${CRATE_NAME}.wasm"