export const INPUT_SPLIT = "\n";
type Coordinate = [number, number]
export function part_1(input: string[]): number {
    const exploreNext: Coordinate[] = []
    const grid = []
    for(const row of input) {
        grid.push(row.split("").map(Number))
    }

    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y]!.length; x++) {
            if(grid[y]![x] === 0) exploreNext.push([y, x])
        }
    }

    console.log(exploreNext)
    let result = 0;
    while(exploreNext.length) {
        const [y, x] = exploreNext.shift()!;
        const tile = grid[y]![x]!
        if(tile === 9) {
            result++;
            continue;
        }
        if(grid[y-1]?.[x] === tile + 1) exploreNext.push([y-1, x])
        if(grid[y+1]?.[x] === tile + 1) exploreNext.push([y+1, x])
        if(grid[y]![x-1] === tile + 1) exploreNext.push([y, x-1])
        if(grid[y]![x+1] === tile + 1) exploreNext.push([y, x+1])
        console.log(exploreNext)
    }

    console.log(grid)
    return result
}


export function part_2(input: string): number {
    return input.length
}