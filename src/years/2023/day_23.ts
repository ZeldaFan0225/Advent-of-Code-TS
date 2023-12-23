/*
=========================
Interfaces
=========================
 */

interface Coordinate {
    x: number,
    y: number
}

interface Tile extends Coordinate {
    c: string,
    visited?: boolean,
    from_node?: number,
    distance?: number
}

interface QueueCoordinate extends Coordinate {
    visited: Set<string>
}

interface Node extends Coordinate {
    id: number,
    connected_to: Set<number>
}



export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const {map, start, end} = parseMap(input, 1)
    return findLongestPath(map, start, end)
}


export function part_2(input: string[]): number {
    const {map, start, end} = parseMap(input, 2)
    const {nodes, distanceMap} = getNodeRepresentation(map, start, end)
    return getPathLengthsFromNodes(nodes, 0, new Set(), distanceMap)
}



/*
=========================
Part 1 specific functions
=========================
 */


function findLongestPath(map: Tile[][], start: Coordinate, end: Coordinate) {
    let queue: QueueCoordinate[] = [{...start, visited: new Set()}]
    const distances = new Map<string, number>
    while(queue.length) {
        const current = queue.shift()!
        const currentTile = map[current.y]![current.x]!
        if(!currentTile) continue;

        current.visited.add(`${current.x},${current.y}`)

        if(current.x === end.x && current.y === end.y) {
            // minus 1 because we don't count the start tile
            distances.set([...current.visited].join(" "), current.visited.size - 1)
            continue;
        }

        for(let neighbor of getNeighbors(map, current, current.visited)) {
            queue.unshift({x: neighbor.x, y: neighbor.y, visited: new Set(current.visited)})
        }
    }

    return Math.max(...distances.values())
}



/*
=========================
Part 2 specific functions
=========================
 */


function getConnectionHash(node1: number, node2: number) {
    return `${Math.min(node1, node2)}-${Math.max(node1, node2)}`
}


function getNodeRepresentation(map: Tile[][], start: Coordinate) {
    const queue = [{...start, coming_from: 0, distance: -1}]
    const nodes: Node[] = []
    const distanceMap = new Map<string, number>()
    while(queue.length) {
        const process = queue.shift()!
        if(map[process.y]?.[process.x]?.visited) {
            if(map[process.y]?.[process.x]?.from_node !== process.coming_from) {
                // when current node has been discovered but from a different node
                const node1 = nodes.find(n => n.id === process.coming_from)!
                const node2 = nodes.find(n => n.id === map[process.y]![process.x]!.from_node!)!
                distanceMap.set(getConnectionHash(node1.id, node2.id), map[process.y]?.[process.x]?.distance! + process.distance + 1)
                node1.connected_to.add(node2.id)
                node2.connected_to.add(node1.id)
            }
            continue
        }
        map[process.y]![process.x]!.visited = true
        const neighbors = getNeighbors(map, process)
        let coming_from = process.coming_from
        let distance = process.distance + 1
        if(neighbors.length > 2 || neighbors.length === 1) {
            // new node found
            const prev_node = nodes.find(n => n.id === process.coming_from)
            prev_node?.connected_to.add(nodes.length)
            nodes.push({id: nodes.length, connected_to: new Set([process.coming_from]), x: process.x, y: process.y})
            distanceMap.set(`${Math.min(process.coming_from, nodes.length - 1)}-${Math.max(process.coming_from, nodes.length - 1)}`, distance)
            coming_from = nodes.length - 1
            distance = 0
        }
        map[process.y]![process.x]!.from_node = coming_from
        map[process.y]![process.x]!.distance = distance
        for(let neighbor of neighbors) {
            queue.push({
                x: neighbor.x,
                y: neighbor.y,
                coming_from,
                distance
            })
        }
    }

    nodes[0]?.connected_to.delete(0)
    distanceMap.delete("0-0")

    return {nodes, distanceMap}
}


function getPathLengthsFromNodes(nodes: Node[], node_i: number, visited: Set<number>, distanceMap: Map<string, number>): number {
    visited.add(node_i)
    if(node_i === nodes.length - 1) return getTotalDistanceFromNodes([...visited], distanceMap)

    const distances: number[] = []

    const neighbors = nodes[node_i]!.connected_to
    for(let neighbor of neighbors) {
        if(visited.has(neighbor)) continue;
        distances.push(getPathLengthsFromNodes(nodes, neighbor, new Set(visited), distanceMap))
    }

    return Math.max(...distances)
}


function getTotalDistanceFromNodes(nodes: number[], distanceMap: Map<string, number>) {
    let total = 0
    for(let i = 1; i < nodes.length; i++) {
        total += distanceMap.get(getConnectionHash(nodes[i - 1]!, nodes[i]!))!
    }
    return total
}



/*
=========================
Utility functions
=========================
 */


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


function getNeighbors(map: Tile[][], coordinate: Coordinate, path?: Set<string>): Tile[] {
    const {x, y} = coordinate
    const result: Tile[] = []
    if(
        map[y]?.[x - 1] &&
        [".", "<"].includes(map[y]?.[x - 1]?.c ?? "") &&
        !path?.has(`${x - 1},${y}`)
    ) result.push(map[y]![x - 1]!)
    if(
        map[y]?.[x + 1] &&
        [".", ">"].includes(map[y]?.[x + 1]?.c ?? "") &&
        !path?.has(`${x + 1},${y}`)
    ) result.push(map[y]![x + 1]!)
    if(
        map[y - 1]?.[x] &&
        [".", "^"].includes(map[y - 1]?.[x]?.c ?? "") &&
        !path?.has(`${x},${y - 1}`)
    ) result.push(map[y - 1]![x]!)
    if(
        map[y + 1]?.[x] &&
        [".", "v"].includes(map[y + 1]?.[x]?.c ?? "") &&
        !path?.has(`${x},${y + 1}`)
    ) result.push(map[y + 1]![x]!)
    return result
}