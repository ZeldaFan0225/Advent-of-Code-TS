export const INPUT_SPLIT = "\n";

export function part_1(input: string[]): number {
    const opLine = input[input.length - 1]!;
    const rowCount = input.length - 1;
    
    // Parse operations once
    const operations: number[] = [];
    for (let i = 0; i < opLine.length; i++) {
        const c = opLine.charCodeAt(i);
        if (c === 42) operations.push(0);      // '*'
        else if (c === 43) operations.push(1); // '+'
        // skip spaces
    }
    
    // Parse all rows into number arrays
    const rows: number[][] = [];
    for (let i = 0; i < rowCount; i++) {
        const parts = input[i]!.split(" ");
        const nums: number[] = [];
        for (const p of parts) {
            if (p) nums.push(+p);
        }
        rows.push(nums);
    }
    
    let sum = 0;
    // manually unroll column-wise computation
    for (let col = 0; col < operations.length; col++) {
        let result = operations[col] === 0 ? 1 : 0;
        for (let row = 0; row < rowCount; row++) {
            if (operations[col] === 0) {
                result *= rows[row]![col]!;
            } else {
                result += rows[row]![col]!;
            }
        }
        sum += result;
    }
    return sum;
}

export function part_2(input: string[]): number {
    const rowCount = input.length - 1;
    const opLine = input[rowCount]!;
    const width = input[0]!.length;
    
    // Parse operations once
    const operations: number[] = [];
    for (let i = 0; i < opLine.length; i++) {
        const c = opLine.charCodeAt(i);
        if (c === 42) operations.push(0);
        else if (c === 43) operations.push(1);
    }
    
    let sum = 0;
    let opIdx = 0;
    let numbers: number[] = [];
    
    for (let col = 0; col < width; col++) {
        // Check if the entire column is spaces
        let allSpace = true;
        for (let row = 0; row < rowCount; row++) {
            if (input[row]!.charCodeAt(col) !== 32) { // not space
                allSpace = false;
                break;
            }
        }
        
        if (allSpace) {
            // Process block
            const op = operations[opIdx++]!;
            let result = op === 0 ? 1 : 0;
            for (const n of numbers) {
                result = op === 0 ? result * n : result + n;
            }
            sum += result;
            numbers = [];
        } else {
            // Build number from column digits
            let num = 0;
            let power = 1;
            for (let row = rowCount - 1; row >= 0; row--) {
                const digit = input[row]!.charCodeAt(col) - 48;
                if (digit >= 0 && digit <= 9) {
                    num += digit * power;
                    power *= 10;
                }
            }
            numbers.push(num);
        }
    }
    
    // Process final block
    const op = operations[opIdx]!;
    let result = op === 0 ? 1 : 0;
    for (const n of numbers) {
        result = op === 0 ? result * n : result + n;
    }
    sum += result;
    
    return sum;
}