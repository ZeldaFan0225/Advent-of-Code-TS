interface Coordinate {
    x: number,
    y: number
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    return getSumOfDistances(input.map(l => l.split("")), 2);
}


export function part_2(input: string[]): number {
    return getSumOfDistances(input.map(l => l.split("")), 1000000);
}


function getSumOfDistances(input: string[][], expansion_factor: number): number {
    const horizontal_empty = getEmptyRows(input)
    const m1: string[][] = rotateMatrix(input)
    const vertical_empty = getEmptyRows(m1)
    const matrix: string[][] = rotateMatrix(m1)

    const galaxy_coords: Coordinate[] = []
    matrix.forEach((l, y) => {
        l.forEach((c, x) => {
            if(c === "#") galaxy_coords.push({x, y})
        })
    })

    let sum = 0
    const count = galaxy_coords.length
    const distances: Record<string, number> = {}
    for(let i = 0; i < count; i++) {
        for(let j = i + 1; j < count; j++) {
            distances[`${i},${j}`] = getExpandedManhattanDistance(galaxy_coords[i]!, galaxy_coords[j]!, expansion_factor, vertical_empty, horizontal_empty);
            sum += getExpandedManhattanDistance(galaxy_coords[i]!, galaxy_coords[j]!, expansion_factor, vertical_empty, horizontal_empty);
        }
    }

    return sum;
}

function getEmptyBetween(a: Coordinate, b: Coordinate, vertical_empty: number[], horizontal_empty: number[]): {empty_x: number, empty_y: number} {
    let empty_x = 0
    let empty_y = 0
    const [lx, hx] = [Math.min(a.x, b.x), Math.max(a.x, b.x)]
    const [ly, hy] = [Math.min(a.y, b.y), Math.max(a.y, b.y)]
    for(let v of vertical_empty) {
        if(lx < v && v < hx) empty_x += 1
    }
    for(let h of horizontal_empty) {
        if(ly < h && h < hy) empty_y += 1
    }

    return {empty_x, empty_y};
}

function getEmptyRows(matrix: string[][]): number[] {
    const result: number[] = []
    for(let i = 0; i < matrix.length; i++) {
        if(matrix[i]?.every(c => c === ".")) {
            result.push(i)
        }
    }
    return result;
}

function rotateMatrix(matrix: string[][]) {
    const result: string[][] = []
    for(let i = 0; i < matrix[0]!.length; i++) {
        result.push(matrix.map(r => r[i]!))
    }
    return result;
}

function getExpandedManhattanDistance(a: Coordinate, b: Coordinate, expansion_factor: number, vertical_empty: number[], horizontal_empty: number[]): number {
    const {empty_x, empty_y} = getEmptyBetween(a, b, vertical_empty, horizontal_empty)
    return (Math.abs(a.x - b.x) - empty_x + (empty_x * expansion_factor)) + (Math.abs(a.y - b.y) - empty_y + (empty_y * expansion_factor))
}