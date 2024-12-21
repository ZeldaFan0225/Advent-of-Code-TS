export const INPUT_SPLIT = "\n";

const NUMERIC_POSITIONS = {
    /** [y, x] */
    "A": [3, 2],
    "0": [3, 1],
    "1": [2, 0],
    "2": [2, 1],
    "3": [2, 2],
    "4": [1, 0],
    "5": [1, 1],
    "6": [1, 2],
    "7": [0, 0],
    "8": [0, 1],
    "9": [0, 2],
} as const
type NumericPosition = keyof typeof NUMERIC_POSITIONS

const DIRECTIONAL_POSTIONS = {
    "A": [0, 2],
    "^": [0, 1],
    "<": [1, 0],
    "v": [1, 1],
    ">": [1, 2],
} as const
type DirectionalPosition = keyof typeof DIRECTIONAL_POSTIONS

export function part_1(input: string[]): number {
    let result = 0
    for(const code of input) {
        result += getScoreForCode(code, 2)
    }
    
    return result
}

export function part_2(input: string): number {
    let result = 0
    for(const code of input) {
        result += getScoreForCode(code, 25)
        console.log(result)
    }
    
    return result
}

const scoreCache = new Map<string, number>();

function getScoreForCode(code: string, robotLayers: number): number {
    // Create a unique key combining code and robotLayers
    const cacheKey = `${code}-${robotLayers}`;
    const cached = scoreCache.get(cacheKey);
    if (cached !== undefined) {
        return cached;
    }

    let sequence = numericToDirectional(code)

    for(let i = 0; i < robotLayers; i++) {
        sequence = directionalToDirectional(sequence)
    }

    const result = parseInt(code.slice(0, -1)) * sequence.length;
    scoreCache.set(cacheKey, result);
    return result
}

function numericToDirectional(code: string): string {
    let [y, x] = NUMERIC_POSITIONS["A"] as [number, number]
    let sequence = ""
    for(let char of code) {
        let [ky, kx] = NUMERIC_POSITIONS[char as NumericPosition]
        let [dy, dx] = [ky - y, kx - x]

        if(x === 0 && ky === 3) {
            // when moving from the first column to the last row
            if(dx > 0) sequence += ">".repeat(dx)
            if(dy > 0) sequence += "v".repeat(dy)
        } else if(y === 3 && kx === 0) {
            // when moving from the last row to the first column
            if(dy < 0) sequence += "^".repeat(-dy)
            if(dx < 0) sequence += "<".repeat(-dx)
        } else {
            // priority to reduce required moves in next layer
            if(dx < 0) sequence += "<".repeat(-dx)
            if(dy > 0) sequence += "v".repeat(dy)
            if(dx > 0) sequence += ">".repeat(dx)
            if(dy < 0) sequence += "^".repeat(-dy)
        }
        sequence += "A"

        ;[y, x] = [ky, kx]
    }

    return sequence
}

function directionalToDirectional(sequence: string): string {
    let [y, x] = DIRECTIONAL_POSTIONS["A"] as [number, number]
    let code = ""
    for(let char of sequence) {
        let [ky, kx] = DIRECTIONAL_POSTIONS[char as DirectionalPosition]
        let [dy, dx] = [ky - y, kx - x]

        // priority: < v > ^ (due to the way the next robot in line has to input this sequence)
        if(y === 0 && kx === 0) {
            // when moving from first row to first column
            if(dy > 0) code += "v".repeat(dy)
            if(dx < 0) code += "<".repeat(-dx)
        } else if(x === 0 && ky === 0) {
            // when moving from the first column to the last row
            if(dx > 0) code += ">".repeat(dx)
            if(dy < 0) code += "^".repeat(-dy)
        } else {
            if(dx < 0) code += "<".repeat(-dx)
            if(dy > 0) code += "v".repeat(dy)
            if(dx > 0) code += ">".repeat(dx)
            if(dy < 0) code += "^".repeat(-dy)
        }

        code += "A"

        ;[y, x] = [ky, kx]
    }

    return code
}
