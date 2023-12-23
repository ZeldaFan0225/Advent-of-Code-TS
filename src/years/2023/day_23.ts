interface Coordinate {
    x: number,
    y: number
}

interface Tile extends Coordinate {
    c: string
}

interface QueueCoordinate extends Coordinate {
    path: string
}

interface DiscoveredCoordinate extends Coordinate {
    distance: number
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const {map, start, end} = parseMap(input, 1)
    return findLongestPath(map, start, end)
}


export function part_2(input: string[]): number {
    const {map, start, end} = parseMap(input, 2)
    return findLongestPath(map, start, end)
}

function parseMap(input: string[], part: 1 | 2) {
    const map: Tile[][] = []
    let start: Coordinate = {x: 0, y: 0}
    let end: Coordinate = {x: 0, y: 0}
    for(let y = 0; y < input.length; y++){
        map.push([] as Tile[])
        for(let x = 0; x < input[y]!.length; x++) {
            if(y === 0 && input[y]![x]! === ".") {
                start = {x,y}
            }
            if(y === input.length - 1 && input[y]![x]! === ".") {
                end = {x,y}
            }
            map.at(-1)!.push({
                c: part === 1 ? input[y]![x]! : (input[y]![x]! === "#" ? "#" : "."),
                x, y
            })
        }
    }
    return {map, start, end}
}


function findLongestPath(map: Tile[][], start: Coordinate, end: Coordinate): number {
    const queue: QueueCoordinate[] = [{...start, path: " "}]
    const distances = new Map<string, number>
    while(queue.length) {
        const current = queue.shift()!
        const currentTile = map[current.y]![current.x]!
        if(!currentTile) continue;
        const newpath = current.path + `${current.x},${current.y} `
        if(distances.has(newpath)) {
            // check if there is a path to this tile
        }
        if(current.x === end.x && current.y === end.y) {
            // minus 1 because we don't count the start tile
            distances.set(newpath, newpath.trim().split(" ").length - 1)
            continue;
        }
        for(let neighbor of getNeighbors(map, current, newpath)) {
            queue.push({x: neighbor.x, y: neighbor.y, path: newpath})
        }
    }

    return Math.max(...distances.values())
}

function findBetterLongestPath(map: Tile[][], start: Coordinate, end: Coordinate) {
    const queue: QueueCoordinate[] = [{...start, path: " "}]
    const paths = new Set<string>
    while(queue.length) {
        const current = queue.shift()!
        const currentTile = map[current.y]![current.x]!
        if(!currentTile) continue;
        const newpath = current.path + `${current.x},${current.y} `
        if(paths.has(newpath)) {
            // check if there is a path to this tile
        }
        if(current.x === end.x && current.y === end.y) {
            // minus 1 because we don't count the start tile
            paths.add(newpath)
            continue;
        }
        for(let neighbor of getNeighbors(map, current, newpath)) {
            queue.push({x: neighbor.x, y: neighbor.y, path: newpath})
        }
    }

    return 0//Math.max(...distances.values())
}

function getBetterNeighbors(map: Tile[][], coordinate: Coordinate, discovered: Map<string, DiscoveredCoordinate>): Tile[] {
    const {x, y} = coordinate
    const result: Tile[] = []
    if(
        map[y]?.[x - 1] &&
        [".", "<"].includes(map[y]?.[x - 1]?.c ?? "") &&
        !discovered.has(`${x - 1},${y}`)
    ) result.push(map[y]![x - 1]!)
    if(
        map[y]?.[x + 1] &&
        [".", ">"].includes(map[y]?.[x + 1]?.c ?? "") &&
        !discovered.has(`${x + 1},${y}`)
    ) result.push(map[y]![x + 1]!)
    if(
        map[y - 1]?.[x] &&
        [".", "^"].includes(map[y - 1]?.[x]?.c ?? "") &&
        !discovered.has(`${x},${y - 1}`)
    ) result.push(map[y - 1]![x]!)
    if(
        map[y + 1]?.[x] &&
        [".", "v"].includes(map[y + 1]?.[x]?.c ?? "") &&
        !discovered.has(`${x},${y + 1}`)
    ) result.push(map[y + 1]![x]!)
    return result
}

function getNeighbors(map: Tile[][], coordinate: Coordinate, path: string): Tile[] {
    const {x, y} = coordinate
    const result: Tile[] = []
    if(
        map[y]?.[x - 1] &&
        [".", "<"].includes(map[y]?.[x - 1]?.c ?? "") &&
        !path.includes(` ${x - 1},${y} `)
    ) result.push(map[y]![x - 1]!)
    if(
        map[y]?.[x + 1] &&
        [".", ">"].includes(map[y]?.[x + 1]?.c ?? "") &&
        !path.includes(` ${x + 1},${y} `)
    ) result.push(map[y]![x + 1]!)
    if(
        map[y - 1]?.[x] &&
        [".", "^"].includes(map[y - 1]?.[x]?.c ?? "") &&
        !path.includes(` ${x},${y - 1} `)
    ) result.push(map[y - 1]![x]!)
    if(
        map[y + 1]?.[x] &&
        [".", "v"].includes(map[y + 1]?.[x]?.c ?? "") &&
        !path.includes(` ${x},${y + 1} `)
    ) result.push(map[y + 1]![x]!)
    return result
}