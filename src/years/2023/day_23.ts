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
    // 4887 is too low
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

function findLongestPath(map: Tile[][], start: Coordinate, end: Coordinate) {
    let queue: QueueCoordinate[] = [{...start, path: " "}]
    const distances = new Map<string, number>
    while(queue.length) {
        const current = queue.shift()!
        const currentTile = map[current.y]![current.x]!
        if(!currentTile) continue;

        const new_path = current.path + `${current.x},${current.y} `

        // filter out any tiles that went through the current tile already as they are guaranteed to have a shorter path; they can be revisited using the longest path through this tile
        queue = queue.filter(q => !q.path.includes(` ${current.x},${current.y} `))

        if(current.x === end.x && current.y === end.y) {
            // minus 1 because we don't count the start tile
            distances.set(new_path, new_path.trim().split(" ").length - 1)
            continue;
        }

        for(let neighbor of getNeighbors(map, current, new_path)) {
            queue.push({x: neighbor.x, y: neighbor.y, path: new_path})
        }
        //console.log(queue)
    }

    /*for(let path of distances.keys()) {
        printPath(map, path)
    }*/

    console.log(distances.values())
    return Math.max(...distances.values())
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

function printPath(map: Tile[][], path: string) {
    for(let y = 0; y < map.length; y++) {
        let line = ""
        for(let x = 0; x < map[y]!.length; x++) {
            if(path.includes(` ${x},${y} `)) line += "O"
            else line += "."//map[y]![x]!.c
        }
        console.log(line)
    }
    console.log("\n\n")
}