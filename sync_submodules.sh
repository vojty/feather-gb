#!/bin/bash
cd "$(dirname "$0")" || exit 1
ROOT_DIR="$(pwd)"
TOOLS_DIR="$ROOT_DIR/.tools"

# Checkout the submodule commits locked in this repository
git submodule sync --recursive
git submodule update --init --recursive

check_status() {
    if [ $? -eq 0 ]; then
        printf " ✅ OK\n"
    else
        printf " ❌ ERROR\n"
    fi
}

# Build wla-dx (wla-gb + wlalink) at the given git ref into .tools/wla-dx-<ref>
# and print the directory containing the binaries.
ensure_wla_dx() {
    local ref="$1"
    local prefix="$TOOLS_DIR/wla-dx-$ref"
    local bin="$prefix/build/binaries"

    if [ -x "$bin/wla-gb" ] && [ -x "$bin/wlalink" ]; then
        echo "$bin"
        return 0
    fi

    if ! command -v cmake >/dev/null 2>&1; then
        echo "cmake is required to build wla-dx (brew install cmake)" >&2
        return 1
    fi

    echo "Building wla-dx $ref..." >&2
    rm -rf "$prefix"
    mkdir -p "$prefix"
    curl -fsSL "https://github.com/vhelin/wla-dx/archive/$ref.tar.gz" \
        | tar xz -C "$prefix" --strip-components=1 || return 1
    # CMake 4 refuses projects declaring cmake_minimum_required < 3.5 and
    # recent clang turns old-style prototypes into errors under -pedantic-errors
    cmake -S "$prefix" -B "$prefix/build" \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_POLICY_VERSION_MINIMUM=3.5 \
        -DCMAKE_C_FLAGS="-Wno-strict-prototypes" >&2 || return 1
    cmake --build "$prefix/build" --target wla-gb wlalink -j >&2 || return 1

    echo "$bin"
}

# Read the wla-dx version a test suite pins in its CI workflow
wla_dx_ref() {
    local ci="$1/.github/workflows/ci.yml"
    local commit version
    commit=$(sed -nE 's/^[[:space:]]*WLA_DX_COMMIT:[[:space:]]*"?([0-9a-f]+)"?.*/\1/p' "$ci")
    version=$(sed -nE 's/^[[:space:]]*WLA_DX_VERSION:[[:space:]]*"?([0-9.]+)"?.*/\1/p' "$ci")
    if [ -n "$commit" ]; then
        echo "$commit"
    elif [ -n "$version" ]; then
        echo "v$version"
    else
        echo "Cannot determine wla-dx version from $ci" >&2
        return 1
    fi
}

# Build a wla-dx based test suite with the wla-dx version it pins
make_wla_suite() {
    local dir="$1"
    local ref bin
    ref=$(wla_dx_ref "$dir") && bin=$(ensure_wla_dx "$ref") || return 1
    cd "$dir" || return 1
    make clean
    make all WLA="$bin/wla-gb" WLALINK="$bin/wlalink"
}

# Update TurtleTests
(
    printf "\n[ Make TurtleTests ]\n"
    cd roms/TurtleTests
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update mooneye-gb
(
    printf "\n[ Make mooneye-test-suite ]\n"
    make_wla_suite roms/mooneye-test-suite
    check_status
)

# Update mealybug-tearoom-tests
(
    printf "\n[ Make mealybug-tearoom-tests ]\n"
    cd roms/mealybug-tearoom-tests
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update dmg-acid2
(
    printf "\n[ Make dmg-acid2 ]\n"
    cd roms/dmg-acid2
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update cgb-acid2
(
    printf "\n[ Make cgb-acid2 ]\n"
    cd roms/cgb-acid2
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update striketrough.gb
(
    printf "\n[ Make striketrough ]\n"
    cd roms/strikethrough
    rgbenv use 0.5.0
    make clean
    make
    check_status
)

# Update BullyGB
(
    printf "\n[ Make BullyGB ]\n"
    cd roms/BullyGB
    rgbenv use 0.5.0
    make clean
    make
    check_status
)

# Update MBC3 Tester
(
    printf "\n[ Make MBC3 Tester ]\n"
    cd roms/MBC3-Tester-gb/disassembly
    rgbenv use 0.4.2
    make clean
    make all
    check_status
)

# Update wilbertpol-test-suite
(
    printf "\n[ Make Wilbert Pol's test suite ]\n"
    make_wla_suite roms/wilbertpol-test-suite
    check_status
)

# Update AGE test roms
(
    printf "\n[ Make AGE test roms ]\n"
    cd roms/age-test-roms
    rgbenv use 0.9.0
    make clean
    make
    check_status
)

# Update docboy-test-suite
(
    printf "\n[ Make docboy-test-suite ]\n"
    cd roms/docboy-test-suite
    rgbenv use 0.9.0
    make clean
    make dmg
    check_status
)
