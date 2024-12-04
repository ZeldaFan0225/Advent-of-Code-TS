export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    let total = 0;

    for(let row of input) {
        total += findXmasInRow(row)
    }

    for(let row of transposeMatrix(input)) {
        total += findXmasInRow(row)
    }
    
    for(let row of getDiagonalsTLBR(input)) {
        total += findXmasInRow(row)
    }
    
    for(let row of getDiagonalsTRBL(input)) {
        total += findXmasInRow(row)
    }

    return total
}

function transposeMatrix(input: string[]) {
    let res: string[] = []
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j < input[i]!.length; j++) {
            res[j] = (res[j] || "") + input[i]![j];
        }
    }
    return res;
}

function getDiagonalsTLBR(input: string[]) {
    let res: string[] = []
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j < input[i]!.length; j++) {
            res[i + j] = (res[i + j] || "") + input[i]![j];
        }
    }
    return res;
}

function getDiagonalsTRBL(input: string[]) {
    let res: string[] = []
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j < input[i]!.length; j++) {
            res[j - i + input.length - 1] = (res[j - i + input.length - 1] || "") + input[i]![j]!;
        }
    }
    return res;
}

function findXmasInRow(row: string) {
    let reg = /(?=(XMAS|SAMX))/g
    let count = 0;
    Array.from(row.matchAll(reg)).forEach(() => {
        count++;
    })

    return count
}

const patterns = [
    ["M", "S", "A", "M", "S"],
    ["M", "M", "A", "S", "S"],
    ["S", "M", "A", "S", "M"],
    ["S", "S", "A", "M", "M"]
]

export function part_2(input: string): number {
    let total = 0;
    for(let i = 1; i < input.length - 1; i++) {
        for(let j = 1; j < input[i]!.length - 1; j++) {
            if(patternMatches(input, i, j)) {
                total++;
            }
        }
    }
    return total
}

function patternMatches(input: string, y: number, x: number) {
    let matches = false;
    for (let i = 0; i < patterns.length; i++) {
        if(
            input[y-1]![x-1] === patterns[i]![0] &&
            input[y-1]![x+1] === patterns[i]![1] &&
            input[y]![x]     === patterns[i]![2] &&
            input[y+1]![x-1] === patterns[i]![3] &&
            input[y+1]![x+1] === patterns[i]![4]
        ) {
            matches = true;
            break;
        }
    }
    return matches;
}