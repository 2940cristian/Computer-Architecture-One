/**
 * LS-8 v2.0 emulator skeleton code
 */

const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;
const MUL = 0b10101010;
const PUSH = 0b01001101;
const SP = 7;
const CALL = 0b01001000;
const RET = 0b00001001;
const POP = 0b01001100;
const ADD = 0b10101000;
const CMP = 0b10100000; 
const JMP = 0b01010000; 
const JEQ = 0b01010001;
const JNE = 0b01010010;
// let E = 0;
// let L = 0;
// let G = 0;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        // Special-purpose registers
        this.reg[SP] = 0xF4;
        this.PC = 0; // Program Counter
        // this.SP = this.reg[this.reg.length -1]
        this.E = 0;
        this.L = 0;
        this.G = 0;
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] *= this.reg[regB];
                break;

            case "ADD": 
                this.reg[regA] += this.reg[regB];
                break;

            case "CMP":
            this.reg[regA] === this.reg[regB] ? this.E = 1 : this.E = 0;
            this.reg[regA] < this.reg[regB] ? this.L = 1 : this.L = 0;
            this.reg[regA] > this.reg[regB] ? this.G = 1 : this.G = 0;
            break;
            
        }
    }


    // pushValue(v) {
    //         this.reg[SP]--;
    //         this.ram.write(this.reg[SP], v)
    // }


    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        const IR = this.ram.read(this.PC);

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        switch(IR) {

            case ADD:
            this.alu("ADD", operandA, operandB);
            break;

            case CMP: 
            this.alu("CMP", operandA, operandB)
            break;

            case JEQ: 
                if(this.E === 1) {
                    this.PC = this.reg[operandA]
                } 
                else this.PC += (IR >> 6) + 1;


            break;

            case JNE:
                if(this.E === 0) {
                    this.PC = this.reg[operandA]
                }
                else this.PC += (IR >> 6) + 1;


            break;

            case LDI:
                // Set the value in a register
                this.reg[operandA] = operandB;
                //this.PC += 3; // Next instruction
            break;

            case CALL:
            this.ram.write(this.reg[SP], this.PC + 2);
            this.PC = this.reg[operandA] - 2
            break;

            case JMP:
            this.PC = this.reg[operandA]
            break;

            case RET:
            this.PC = this.ram.read(this.reg[SP]) - 1
            break;

            case PUSH:

            this.reg[SP]--;
            this.ram.write(this.reg[SP], this.reg[operandA]);
            break;


            case POP: 
            this.reg[operandA] = this.ram.read(this.reg[SP]);
            this.reg[SP]++;
            break;

            case PRN:
                console.log(this.reg[operandA]);
                break;

            case HLT:
                this.stopClock();
                break;
            
            case MUL:
            this.alu("MUL", operandA, operandB);
            break;

            // case PEEK:
            //     console.log(this.ram.read(this.SP));
            //     this.PC++;
            // break;

            default:
                console.log("Unknown instruction: " + IR.toString(2));
                this.stopClock();
                return;
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        if(IR != JEQ && IR != JNE){
            this.PC += (IR >> 6) + 1;
        }
    }
}

module.exports = CPU;