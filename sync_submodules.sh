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
    make clean
    make all
    check_status
)

# Update mooneye-gb
(
    printf "\n[ Make mooneye-test-suite ]\n"
    cd roms/mooneye-test-suite
    make clean
    make all
    check_status
)

# Update mealybug-tearoom-tests
(
    printf "\n[ Make mealybug-tearoom-tests ]\n"
    cd roms/mealybug-tearoom-tests
    make clean
    make all
)

# Update dmg-acid2
(
    printf "\n[ Make dmg-acid2 ]\n"
    cd roms/dmg-acid2
    make clean
    make all
    check_status
)

# Update cgb-acid2
(
    echo "[ Make cgb-acid2 ]"
    cd roms/cgb-acid2
    make clean
    make all
    check_status
)

# Update striketrough.gb
(
    echo "[ Make striketrough ]"
    cd roms/strikethrough
    make clean
    make
)

# Update BullyGB
(
    echo "[ Make BullyGB ]"
    cd roms/BullyGB
    make clean
    make
    check_status
)

# Update wilbertpol-test-suite
(
    echo "[ Make Wilbert Pol's test suite ]"
    cd roms/wilbertpol-test-suite
    make clean
    make
    check_status
)
