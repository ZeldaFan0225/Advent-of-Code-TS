export const INPUT_SPLIT = "\n";
const GRIDSIZE = 71
const FIRSTNBYTES = 1024

const DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
] as const

export function part_1(input: string[]): number {
    const corruptedBytes = new Set<string>(input.slice(0, FIRSTNBYTES))

    return findShortestPath(corruptedBytes)
}

function findShortestPath(corruptedBytes: Set<string>) {
    let visited = new Set<string>()
    let queue: [number, number, number][] = [[0, 0, 0]]
    let shortestDistance = Infinity

    let next;
    outer:
    while((next = queue.shift()) !== undefined) {
        const [x, y, distance] = next
        const key = `${x},${y}`
        if (visited.has(key)) {
            continue;
        }
        visited.add(key)

        for(const [dx, dy] of DIRECTIONS) {
            const nx = x + dx
            const ny = y + dy
            const nkey = `${nx},${ny}`
            if (nx === GRIDSIZE - 1 && ny === GRIDSIZE - 1) {
                shortestDistance = distance + 1;
                break outer;
            }
            if (
                nx < 0 ||
                nx >= GRIDSIZE ||
                ny < 0 ||
                ny >= GRIDSIZE ||
                visited.has(nkey) ||
                corruptedBytes.has(nkey)
            ) {
                continue;
            }
            queue.push([nx, ny, distance + 1])
        }

        queue.sort((a, b) => (distanceToGoal(a[0], a[1]) + a[2]) - (distanceToGoal(b[0], b[1]) + b[2]))
    }

    return shortestDistance
}


function distanceToGoal(x: number, y: number): number {
    return Math.abs(x - GRIDSIZE) + Math.abs(y - GRIDSIZE)
}

export function part_2(input: string[]): string {
    // Good old brute force :D
    for(let i = 1024; i < input.length; i++) {
        const shortestDistance = findShortestPath(new Set(input.slice(0, i)))
        if (shortestDistance === Infinity) {
            // i-1 because slice is exclusive
            return input[i-1]!;
        }
    }
    return "No solution found"
}