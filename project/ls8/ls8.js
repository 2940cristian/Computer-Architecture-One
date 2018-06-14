const RAM = require('./ram');
const CPU = require('./cpu');
let program;


if(process.argv[2] === "print8.ls8") {
    program = [
        "10011001", // LDI R0,8  Store 8 into R0
        "00000000",
        "00001000",
        "01000011", // PRN R0    Print the value in R0
        "00000000",
        "00000001"  // HLT       Halt and quit
    ]
}

else if(process.argv[2] === "stack.ls8") {
    program =[
        "10011001", //# LDI R0,1
        "00000000",
        "00000001",
        "10011001",//# LDI R1,2
        "00000001",
        "00000010",
        "01001101" ,//# PUSH R0
        "00000000",
        "01001100" ,//# POP R1
        "00000001",
        "01000011" ,//# PRN R1
        "00000001",

        "10011001", //# LDI R0,2
        "00000000",
        "00000010",
        "01001101" ,//# PUSH R0
        "00000000",
        "10011001" ,//# LDI R0,3
        "00000000",
        "00000011",
        "01001100" ,//# POP R0
        "00000000",
        "01000011" ,//# PRN R0
        "00000000",
        "00000001" //# HLT

    ]
}

else if(process.argv[2] === "mult.ls8") {
    program = [
    "10011001", //LDI R0,8
    "00000000",
    "00001000",
    "10011001", //LDI R1,9
    "00000001",
    "00001001",
    "10101010", //MUL R0,R1 <---
    "00000000",
    "00000001",
    "01000011", //PRN R0
    "00000000",
    "01001101", //Push
    "00001000", //Prn 4
    "00000001" //HLT
    ]
}
else if(process.argv[2] === "call.ls8") {
    program = [
        "10011001", // # LDI R1,MULT2PRINT  R1 points to the MULT2PRINT subroutine
        "00000001", //
        "00011000", 

        "10011001", //# LDI R0,10          Load R0 with 10
        "00000000",
        "00001010",
        "01001000", // # CALL R1            Call MULT2PRINT, prints 20
        "00000001",

        "10011001", //# LDI R0,15          Load R0 with 15
        "00000000",
        "00001111",
        "01001000", // # CALL R1            Call MULT2PRINT, prints 30
        "00000001",

        "10011001", //# LDI R0,18          Load R0 with 18
        "00000000", //
        "00010010",
        "01001000", //# CALL R1            Call MULT2PRINT, prints 36
        "00000001",

        "10011001", //# LDI R0,30          Load R0 with 30
        "00000000",
        "00011110",
        "01001000", // # CALL R1            Call MULT2PRINT, prints 60
        "00000001",

        "00000001", //# HLT

        //# MULT2PRINT (24):

        "10101000", // # ADD R0,R0         Mult R0 by 2 (add it to itself)
        "00000000",
        "00000000",
        "01000011", //# PRN R0            Print R0
        "00000000",
        "00001001", // # RET
    ]
}

else {
    program = []
}


/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {

    // Hardcoded program to print the number 8 on the console
        program;

        if(program.length < 1) {
            throw new Error ("\nDid not pass a parameter into the command line \n Ex: node ls8.js mult.ls8 \n \n  ")
        }
    // const program = [ // print8.ls8
        // "10011001", // LDI R0,8  Store 8 into R0
        // "00000000",
        // "00001000",
        // "01000011", // PRN R0    Print the value in R0
        // "00000000",
        // "00000001"  // HLT       Halt and quit


        // "10011001", //LDI R0,8
        // "00000000",
        // "00001000",
        // "10011001", //LDI R1,9
        // "00000001",
        // "00001001",
        // "10101010", //MUL R0,R1 <---
        // "00000000",
        // "00000001",
        // "01000011", //PRN R0
        // "00000000",
        // "00000001" //HLT
    // ];

    // Load the program into the CPU's memory a byte at a time
    for (let i = 0; i < program.length; i++) {
        cpu.poke(i, parseInt(program[i], 2));
    }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();
