interface Coordinate {
    x: number,
    y: number
}

interface Tile extends Coordinate {
    c: string,
    steps: number
}

export const INPUT_SPLIT = "\n"
export function part_1(input: string[]): number {
    const start = {x:0, y:0}
    const tiles = input.map((i, y) => i.split("").map((c, x) => {
        if(c === "S") {
            start.x = x
            start.y = y
        }
        return {x, y, c, steps: 0}
    }))

    return findAmountReachable(tiles, 64, start, 1)
}


export function part_2(input: string[]): number {
    const start = {x:0, y:0}
    const tiles = input.map((i, y) => i.split("").map((c, x) => {
        if(c === "S") {
            start.x = x
            start.y = y
        }
        return {x, y, c, steps: 0}
    }))

    return findAmountReachable(tiles, 100, start, 2)
}


function findAmountReachable(map: Tile[][], steps: number, start: Coordinate, part: 1 | 2): number {
    const width = map[0]!.length
    const height = map.length
    const queue = new Map<string, Tile>()
    queue.set(`${start.x},${start.y},0`, map[start.y]![start.x]!)
    const last_tiles = new Set<string>()
    while(queue.size) {
        const temp = queue.keys().next().value
        const process = queue.get(temp)
        if(!process) throw new Error("Invalid process")
        queue.delete(temp)
        if(process.steps === steps) {
            last_tiles.add(`${process.x},${process.y}`)
            continue
        }
        // starting point but not on the original map
        if(getActualCoordinates(process.x, width) === start.x && getActualCoordinates(process.y, height) === start.y && (process.x !== start.x || process.y !== start.y)) {
            console.log("new center found")
            for(let v of queue.values()) {
                const newtile = {
                    ...v,
                    steps: v.steps + process.steps,
                    x: v.x + (process.x - start.x),
                    y: v.y + (process.y - start.y)
                }
                queue.set(`${newtile.x},${newtile.y},${newtile.steps}`, newtile)
            }
            continue
        }
        const neighbors = findAdjacent(process, map, width, height, part === 2)
        for(let neighbor of neighbors) {
            // create new tile because one tile can probably be visited from multiple positions
            if(last_tiles.has(`${neighbor.x},${neighbor.y}`)) continue
            queue.set(`${neighbor.x},${neighbor.y},${process.steps + 1}`, {
                ...neighbor,
                steps: process.steps + 1
            })
        }
    }
    return last_tiles.size
}

function findAdjacent(coordinate: Coordinate, map: Tile[][], width: number, height: number, infinite_map?: boolean) {
    const {x, y} = coordinate
    if(getActualCoordinates(x, width) === 6 && getActualCoordinates(y, height) === 6 && (x !==6 || y !== 6)) console.log(x, y)
    const adjacent: Tile[] = []
    if(infinite_map) {
        const gac = getActualCoordinates
        if(map[gac(y - 1, height)] && map[gac(y - 1, height)]![gac(x, width)]?.c !== "#") adjacent.push({...map[gac(y - 1, height)]![gac(x, width)]!, x, y: y-1})
        if(map[gac(y + 1, height)] && map[gac(y + 1, height)]![gac(x, width)]?.c !== "#") adjacent.push({...map[gac(y + 1, height)]![gac(x, width)]!, x, y: y+1})
        if(map[gac(y, height)]![gac(x - 1, width)] && map[gac(y, height)]![gac(x - 1, width)]?.c !== "#") adjacent.push({...map[gac(y, height)]![gac(x - 1, width)]!, x:x-1, y})
        if(map[gac(y, height)]![gac(x + 1, width)] && map[gac(y, height)]![gac(x + 1, width)]?.c !== "#") adjacent.push({...map[gac(y, height)]![gac(x - 1, width)]!, x:x+1, y})
    } else {
        if(map[y - 1] && map[y - 1]![x]?.c !== "#") adjacent.push(map[y - 1]![x]!)
        if(map[y + 1] && map[y + 1]![x]?.c !== "#") adjacent.push(map[y + 1]![x]!)
        if(map[y]![x - 1] && map[y]![x - 1]?.c !== "#") adjacent.push(map[y]![x - 1]!)
        if(map[y]![x + 1] && map[y]![x + 1]?.c !== "#") adjacent.push(map[y]![x + 1]!)
    }
    return adjacent
}

function getActualCoordinates(num: number, size: number) {
    let result = num % size
    if(result < 0) result += size
    return result
}

function printQueue(queue: Tile[], map: Tile[][]) {
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[0]!.length; j++) {
            if(queue.find(q => q.x === j && q.y === i)) process.stdout.write("O")
            else process.stdout.write(map[i]![j]!.c)
        }
        process.stdout.write("\n")
    }
    process.stdout.write("\n")
}