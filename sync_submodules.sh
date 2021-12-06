#!/bin/bash
# git submodule foreach git pull --rebase origin master
git submodule update --init --recursive

# Update TurtleTests
(
    echo "[ Make TurtleTests ]"
    cd roms/TurtleTests
    make clean
    make all
)

# Update mooneye-gb
(
    echo "[ Make mooneye-test-suite ]"
    cd roms/mooneye-test-suite
    make clean
    make all
)

# Update mealybug-tearoom-tests
(
    echo "[ Make mealybug-tearoom-tests ]"
    cd roms/mealybug-tearoom-tests
    make clean
    make all
)

# Update dmg-acid2
(
    echo "[ Make dmg-acid2 ]"
    cd roms/dmg-acid2
    make clean
    make all
)

# Update cgb-acid2
(
    echo "[ Make cgb-acid2 ]"
    cd roms/cgb-acid2
    make clean
    make all
)

# Update striketrough.gb
(
    echo "[ Make striketrough ]"
    cd roms/strikethrough
    make clean
    make
)
