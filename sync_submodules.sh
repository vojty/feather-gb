#!/bin/bash
git submodule foreach git pull --rebase
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

# Update BullyGB
(
    echo "[ Make BullyGB ]"
    cd roms/BullyGB
    make clean
    make
)

# Update wilbertpol-test-suite
(
    echo "[ Make Wilbert Pol's test suite ]"
    cd roms/wilbertpol-test-suite
    make clean
    make
)
