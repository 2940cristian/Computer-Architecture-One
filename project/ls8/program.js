let MUL = process.argv.slice(2);
let PRINT8 = process.argv.slice(2);

MUL = [
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
    "00000001" //HLT
]

PRINT8 = [
    "10011001", // LDI R0,8  Store 8 into R0
    "00000000",
    "00001000",
    "01000011", // PRN R0    Print the value in R0
    "00000000",
    "00000001"  // HLT       Halt and quit
]

module.exports = {
    MUL,
    PRINT8
}