export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    let total = 0;
    for(let row of input) {
        total += findXmasInRow(row)
    }
    for(let row of transposeMatrix(input)) {
        total += findXmasInRow(row)
    }
    for(let row of getDiagonals(input)) {
        total += findXmasInRow(row)
    }
    return total
}

function transposeMatrix(input: string[]) {
    let res: string[] = []
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j < input[i]!.length; j++) {
            res[i] = (res[i] || "") + input[i]![j]!;
        }
    }
    return res;
}

function getDiagonals(input: string[]) {
    let res: string[] = []
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j < input[i]!.length; j++) {
            res[i + j] = (res[i + j] || "") + input[i]![j]!;
        }
    }
    return res;
}

function findXmasInRow(row: string): number {
    let match;
    let reg = /XMAS|SAMX/g
    let count = 0;
    while((match = reg.exec(row)) != null) {
        count++;
    }

    return count
}

export function part_2(input: string): number {
    return input.length
}