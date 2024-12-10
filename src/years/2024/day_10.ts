export const INPUT_SPLIT = "\n";
type Coordinate = [number, number]

export function part_1(input: string[]): number {
    const grid = []
    for(const row of input) {
        grid.push(row.split("").map(Number))
    }

    let result = 0;
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y]!.length; x++) {
            if(grid[y]![x] === 0) {
                result += getTrailheadScore(grid, [y, x], true)
            }
        }
    }

    return result
}

export function part_2(input: string): number {
    const grid = []
    for(const row of input) {
        grid.push(row.split("").map(Number))
    }

    let result = 0;
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y]!.length; x++) {
            if(grid[y]![x] === 0) {
                result += getTrailheadScore(grid, [y, x], false)
            }
        }
    }

    return result
}

function getTrailheadScore(grid: number[][], startPosition: Coordinate, uniqueTrails = true): number {
    const trailEnds = new Set();
    const exploreNext = [startPosition]
    let result = 0;
    while(exploreNext.length) {
        const [y, x] = exploreNext.shift()!;
        const tile = grid[y]![x]!
        if(tile === 9) {
            if(uniqueTrails) {
                if(trailEnds.has(`${y},${x}`)) continue;
                trailEnds.add(`${y},${x}`)
            }
            result++;
            continue;
        }
        if(grid[y-1]?.[x] === tile + 1) exploreNext.push([y-1, x])
        if(grid[y+1]?.[x] === tile + 1) exploreNext.push([y+1, x])
        if(grid[y]![x-1] === tile + 1) exploreNext.push([y, x-1])
        if(grid[y]![x+1] === tile + 1) exploreNext.push([y, x+1])
    }
    return result
}
