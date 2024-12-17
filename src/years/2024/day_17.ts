export const INPUT_SPLIT = undefined;

/**
 * Functions for opcodes
 * Return value > -1 indicates the new position of the instruction pointer
 */
const OPERATIONS = [
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        const denominator = 2n ** getComboOperand(operand, registers);
        const numerator = registers[0]!;
        registers[0] = numerator / denominator;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        registers[1] = registers[1] ^ operand;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        const val = getComboOperand(operand, registers) % 8n;
        registers[1] = val;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        if(registers[0] === 0n) return instructionPointerPosition + 2;
        return Number(operand);
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        registers[1] = registers[1] ^ registers[2];
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        const val = getComboOperand(operand, registers) % 8n;
        output.push(Number(val));
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
        const denominator = 2n ** getComboOperand(operand, registers);
        const numerator = registers[0]!;
        registers[1] = numerator / denominator;
        return instructionPointerPosition + 2;
    },
    (operand: bigint, registers: [bigint, bigint, bigint], output: number[], instructionPointerPosition: number) => {
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
    let output: number[] = []
    while(instructionPointer < instructions.length) {
        instructionPointer = OPERATIONS[Number(instructions[instructionPointer]!)]!(
            instructions[instructionPointer + 1]!,
            registers,
            output,
            instructionPointer
        )!;
    }
    return output;
}

export function part_1(input: string): string {
    const reg = /^Register A: (?<rega>\d+)\nRegister B: (?<regb>\d+)\nRegister C: (?<regc>\d+)\n\nProgram: (?<prog>.+)/g;
    const {rega, regb, regc, prog} = reg.exec(input)!.groups!;
    
    const registers = [BigInt(rega!), BigInt(regb!), BigInt(regc!)] as [bigint, bigint, bigint];
    const instructions = prog!.split(",").map(x => BigInt(x));

    const output = getOutputFromProgram(registers, instructions);

    return output.join(",");
}

export function part_2(input: string): bigint {
    // Parse input to get initial register values and program instructions
    const reg = /^Register A: (?<rega>\d+)\nRegister B: (?<regb>\d+)\nRegister C: (?<regc>\d+)\n\nProgram: (?<prog>.+)/g;
    const {regb, regc, prog} = reg.exec(input)!.groups!;
    
    const initialRegisterB = BigInt(regb!);
    const initialRegisterC = BigInt(regc!);
    const instructions = prog!.split(",").map(x => BigInt(x));

    // Start with initial candidate value 0
    let candidateValues: bigint[] = [0n];
    
    // Get expected output sequence by reversing program instructions
    const expectedOutputSequence = [...instructions].reverse().map(x => Number(x));
    
    // For each expected output value in the sequence
    for (const expectedOutput of expectedOutputSequence) {
        const validCandidates: bigint[] = [];
        
        // Try each current candidate value
        for (const candidateValue of candidateValues) {
            // For each possible 3-bit value (0-7)
            for (let bitValue = 0; bitValue < 8; bitValue++) {
                // Create new test value by shifting left 3 bits and adding new bit value
                const testValue = (candidateValue << 3n) | BigInt(bitValue);
                
                // Run program with this test value
                const programOutput = getOutputFromProgram(
                    [testValue, initialRegisterB, initialRegisterC],
                    instructions
                );
                if(!programOutput.length) {
                    // If program halts, skip this test value
                    continue;
                }
                
                // Parse first output value and compare with expected
                const firstOutput = programOutput[0]!;
                if (firstOutput === expectedOutput) {
                    validCandidates.push(testValue);
                }
            }
        }
        
        // If no valid candidates found, program is unsolvable
        if (validCandidates.length === 0) {
            console.log("No solution found");
            return 0n;
        }
        
        // Update candidates for next iteration
        candidateValues = validCandidates;
    }
    
    // Return smallest valid input value found
    candidateValues.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    return candidateValues[0]!;
}
