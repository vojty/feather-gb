#!/bin/bash
git submodule update --init --recursive
git submodule update --remote

check_status() {
    if [ $? -eq 0 ]; then
        printf " ✅ OK\n"
    else
        printf " ❌ ERROR\n"
    fi
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
    cd roms/mooneye-test-suite
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update mealybug-tearoom-tests
(
    printf "\n[ Make mealybug-tearoom-tests ]\n"
    cd roms/mealybug-tearoom-tests
    git submodule update --init --recursive --checkout
    rgbenv use 0.5.0
    make clean
    make all
)

# Update dmg-acid2
(
    printf "\n[ Make dmg-acid2 ]\n"
    cd roms/dmg-acid2
    git submodule update --init --recursive --checkout
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update cgb-acid2
(
    echo "[ Make cgb-acid2 ]"
    cd roms/cgb-acid2
    git submodule update --init --recursive --checkout
    rgbenv use 0.5.0
    make clean
    make all
    check_status
)

# Update striketrough.gb
(
    echo "[ Make striketrough ]"
    cd roms/strikethrough
    rgbenv use 0.5.0
    make clean
    make
)

# Update BullyGB
(
    echo "[ Make BullyGB ]"
    cd roms/BullyGB
    rgbenv use 0.5.0
    make clean
    make
    check_status
)

# Update MBC3 Tester
(
    echo "[ Make MBC3 Tester ]"
    cd roms/MBC3-Tester-gb/disassembly
    rgbenv use 0.4.2
    make clean
    make all
    check_status
)

# Update wilbertpol-test-suite
(
    echo "[ Make Wilbert Pol's test suite ]"
    cd roms/wilbertpol-test-suite
    rgbenv use 0.5.0
    make clean
    make
    check_status
)

# Update AGE test roms
(
    echo "[ Make AGE test roms ]"
    cd roms/age-test-roms
    rgbenv use 0.5.0
    make clean
    make
    check_status
)
