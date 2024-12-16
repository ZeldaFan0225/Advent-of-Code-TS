export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    let exploreNext: [number, number][] = [];
    let goal: [number, number] = [0, 0];
    const explored = new Map<string, number>();

    const grid = input.map((line, i) => {
        const cells = line.split('');
        if(cells.indexOf('S') !== -1) {
            exploreNext.push([i, cells.indexOf('S')]);
        }
        if(cells.indexOf('E') !== -1) {
            goal = [i, cells.indexOf('E')];
        }
    });

    while(exploreNext.length) {
        const [x, y] = exploreNext.shift()!;
        const key = `${x},${y}`;
        if(explored.has(key)) {
            continue;
        }
    }

    console.log(exploreNext, goal);

    return 0
}


export function part_2(input: string[]): number {
    return input.length
}