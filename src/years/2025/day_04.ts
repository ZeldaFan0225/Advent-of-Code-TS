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


export function part_2(input: string[]): number {
    return input.length
}