export const INPUT_SPLIT = "\n";

const around = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1],
] as const

function parseMaze(grid: string[], logShift: number) {
    const paperRolls = new Set<number>();
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y]!.length; x++) {
            if(grid[y]![x] === '@') {
                // combine x and y into a single number for easier storage
                paperRolls.add(x | (y << logShift));
            }
        }
    }
    return paperRolls;
}

function removePaperRolls(paperRolls: Set<number>, logShift: number) {
    let removedCount = 0;
    let remove = new Set<number>();
    for(const roll of paperRolls) {
        const x = roll & ((1 << logShift) - 1);
        const y = roll >> logShift;

        let count = 0;
        for(const [dx, dy] of around) {
            const neighbor = (x + dx) | ((y + dy) << logShift);
            if(paperRolls.has(neighbor)) {
                count++;
            }
        }
        if(count < 4) {
            remove.add(roll);
            removedCount++;
        }
    }
    for (const roll of remove) {
        paperRolls.delete(roll);
    }
    return remove.size;
}

export function part_1(input: string[]): number {
    const maxShift = Math.max(Math.ceil(Math.log2(input.length)), Math.ceil(Math.log2(input[0]!.length)));
    const paperRolls = parseMaze(input, maxShift);
    return removePaperRolls(paperRolls, maxShift);
}

export function part_2(input: string[]): number {
    const maxShift = Math.max(Math.ceil(Math.log2(input.length)), Math.ceil(Math.log2(input[0]!.length)));
    const paperRolls = parseMaze(input, maxShift);
    let previousCount = -1;
    let totalRemoved = 0;
    while(previousCount !== 0) {
        previousCount = removePaperRolls(paperRolls, maxShift);
        totalRemoved += previousCount;
    }
    return totalRemoved;
}