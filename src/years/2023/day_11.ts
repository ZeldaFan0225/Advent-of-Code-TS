interface Coordinate {
    x: number,
    y: number
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    return getSumOfDistances(input, 2);
}


export function part_2(input: string[]): number {
    return getSumOfDistances(input, 1000000);
}


function getSumOfDistances(input: string[], expansion_factor: number): number {
    const {horizontal_empty, vertical_empty, coordinates} = getMatrixData(input)

    let sum = 0
    const count = coordinates.length
    for(let i = 0; i < count; i++) {
        for(let j = i + 1; j < count; j++) {
            sum += getExpandedManhattanDistance(coordinates[i]!, coordinates[j]!, expansion_factor, vertical_empty, horizontal_empty);
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

function getExpandedManhattanDistance(a: Coordinate, b: Coordinate, expansion_factor: number, vertical_empty: number[], horizontal_empty: number[]): number {
    const {empty_x, empty_y} = getEmptyBetween(a, b, vertical_empty, horizontal_empty)
    return (Math.abs(a.x - b.x) - empty_x + (empty_x * expansion_factor)) + (Math.abs(a.y - b.y) - empty_y + (empty_y * expansion_factor))
}

function getMatrixData(input: string[]) {
    const horizontal_empty = []
    const vertical_empty = []
    const coordinates: Coordinate[] = []
    const v_count: number[] = []

    for (let i = 0; i < input.length; i++) {
        if(input[i]!.replaceAll(".", "") === "") horizontal_empty.push(i)
        for(let j = 0; j < input[i]!.length; j++) {
            if(input[i]![j] === ".") v_count[j] = (v_count[j] ?? 0) + 1;
            else {
                coordinates.push({
                    y: i,
                    x: j
                })
            }
        }
    }
    for(let i = 0; i < v_count.length; i++) {
        if(v_count[i] === input.length) vertical_empty.push(i)
    }

    return {horizontal_empty, vertical_empty, coordinates}
}