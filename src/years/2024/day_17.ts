export const INPUT_SPLIT = undefined;

/**
 * Functions for opcodes
 * Return value > -1 indicates the new position of the instruction pointer
 */
const OPERATIONS = [
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        const denominator = 2n ** getComboOperand(operand, registers);
        const numerator = registers[0]!;
        registers[0] = numerator / denominator;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        registers[1] = registers[1] ^ operand;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        const val = getComboOperand(operand, registers) % 8n;
        registers[1] = val;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        if(registers[0] === 0n) return instructionPointerPosition + 2;
        return Number(operand);
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        registers[1] = registers[1] ^ registers[2];
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        const val = getComboOperand(operand, registers) % 8n;
        output.push(`${val}`);
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        const denominator = 2n ** getComboOperand(operand, registers);
        const numerator = registers[0]!;
        registers[1] = numerator / denominator;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: string[], instructionPointerPosition: number) => {
        const denominator = 2n ** getComboOperand(operand, registers);
        const numerator = registers[0]!;
        registers[2] = numerator / denominator;
        return instructionPointerPosition + 2;
    },
] as const

function getComboOperand(operand: bigint, registers: [bigint, bigint, bigint]): bigint {
    switch(Number(operand)) {
        case 0:
        case 1:
        case 2:
        case 3: {
            return operand;
        }
        case 4:
        case 5:
        case 6: {
            return registers[Number(operand) - 4]!;
        }
    }
    throw new Error("Unsupported opcode");
}

function getOutputFromProgram(registers: [bigint, bigint, bigint], instructions: bigint[]) {
    let instructionPointer = 0;
    let output: string[] = []
    while(instructionPointer < instructions.length) {
        instructionPointer = OPERATIONS[Number(instructions[instructionPointer]!)]!(
            instructions[instructionPointer + 1]!,
            registers,
            output,
            instructionPointer
        )!;
    }
    return output.join(",");
}

export function part_1(input: string): number {
    const reg = /^Register A: (?<rega>\d+)\nRegister B: (?<regb>\d+)\nRegister C: (?<regc>\d+)\n\nProgram: (?<prog>.+)/g;
    const {rega, regb, regc, prog} = reg.exec(input)!.groups!;
    
    const registers = [BigInt(rega!), BigInt(regb!), BigInt(regc!)] as [bigint, bigint, bigint];
    const instructions = prog!.split(",").map(x => BigInt(x));

    const output = getOutputFromProgram(registers, instructions);

    console.log("Correct Part 1 result: ", output);
    return -1;
}

function findSeedValue(instructions: bigint[]): bigint {
    // We need to find a value that, when processed through the program,
    // will output the instruction sequence itself
    
    // Each instruction needs 3 bits (since output is mod 8)
    // We'll build the number from right to left
    let value = 0n;
    
    // Process instructions in reverse
    for (let i = instructions.length - 1; i >= 0; i--) {
        // Get the target instruction value
        const target = instructions[i]! % 8n;
        
        // Shift left by 3 bits to make room for the next value
        // We only need 3 bits per value since we're working with mod 8
        value = value << 3n;
        
        // Add this instruction's bits
        value = value | target;
    }
    
    // Add minimal padding at the start to handle initial divisions
    value = value << 1n;
    
    return value;
}

export function part_2(input: string): bigint {
    const reg = /^Register A: (?<rega>\d+)\nRegister B: (?<regb>\d+)\nRegister C: (?<regc>\d+)\n\nProgram: (?<prog>.+)/g;
    const {prog} = reg.exec(input)!.groups!;
    
    const instructions = prog!.split(",").map(x => BigInt(x));
    
    // Calculate the required initial value for register A
    const result = findSeedValue(instructions);
    
    // Verify our result
    const output = getOutputFromProgram([result, 0n, 0n], instructions);
    const expectedOutput = prog;
    
    if (output !== expectedOutput) {
        console.log("Got output:", output);
        console.log("Expected:", expectedOutput);
        throw new Error("Failed to find correct seed value");
    }
    
    return result;
}
