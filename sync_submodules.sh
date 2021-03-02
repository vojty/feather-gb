#!/bin/bash
# git submodule foreach git pull --rebase origin master
git submodule update --recursive

# Update TurtleTests
(
    echo "[ Make TurtleTests ]"
    cd roms/TurtleTests
    make clean
    make all
)

# Update mooneye-gb
(
    echo "[ Make mooneye-gb ]"
    cd roms/mooneye-gb/tests
    make clean
    make all
)

# # Update mealybug-tearoom-tests
# (
#     echo "[ Make mealybug-tearoom-tests ]"
#     cd roms/mealybug-tearoom-tests
#     make clean
#     make all
# )

# Update BullyGB
# (
#     echo "[ Make BullyGB ]"
#     cd roms/BullyGB
#     make clean
#     make
# )
