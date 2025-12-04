export const INPUT_SPLIT = "\n";
function processPaperRoll(input: string[], y: number, x: number): number {
    const around = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1],
    ] as const;
    let positions = new Set<string>();
    for(const [dy, dx] of around) {
        const newY = y + dy;
        const newX = x + dx;
        if(newY < 0 || newY >= input.length || newX < 0 || newX >= input[0]!.length) {
            continue;
        }
        if(input[newY]![newX] === "@") {
            positions.add(`${newY},${newX}`);
        }
    }
    return positions.size < 4 ? 1 : 0;
}

export function part_1(input: string[]): number {
    let count = 0;
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(input[y]![x] === "@") {
                const res = processPaperRoll(input, y, x);
                count += res;
            }
        }
    }
    return count;
}

function removePaperRolls(input: string[][]): number {
    let removed = 0;
    const positions = new Set<string>();
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            const res = removePaperRoll(input, y, x);
            removed += res;
            if(res) positions.add(`${y},${x}`);
        }
    }
    for(const pos of positions) {
        const [yStr, xStr] = pos.split(",");
        const y = Number(yStr);
        const x = Number(xStr);
        input[y]![x] = ".";
    }
    return removed;
}

function removePaperRoll(input: string[][], y: number, x: number): number {
    if(input[y]![x] !== "@") {
        return 0;
    }
    const around = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1],
    ] as const;
    let positions = new Set<string>();
    for(const [dy, dx] of around) {
        const newY = y + dy;
        const newX = x + dx;
        if(newY < 0 || newY >= input.length || newX < 0 || newX >= input[0]!.length) {
            continue;
        }
        if(input[newY]![newX] === "@") {
            positions.add(`${newY},${newX}`);
        }
    }

    return positions.size < 4 ? 1 : 0;
}

export function part_2(input: string[]): number {
    const grid = input.map(line => line.split(""));
    let lastRemoved = -1;
    let totalRemoved = 0;
    while(lastRemoved !== 0) {
        lastRemoved = removePaperRolls(grid);
        totalRemoved += lastRemoved;
    }
    return totalRemoved;
}