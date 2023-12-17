interface Coordinate {
    x: number,
    y: number
}

enum Directions {
    UP, RIGHT, DOWN, LEFT
}

const Adjacent: Coordinate[] = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
]

interface SourceNode extends Coordinate {
    heatLoss: number
}

interface ProcessNode extends SourceNode {
    sameMoveCount: number,
    direction: Directions
}


export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const heatValues: number[][] =  input.map((l) => l.split("").map((c) => parseInt(c)))

    return determineShortestPath(heatValues, 1, 3)
}


export function part_2(input: string[]): number {
    const heatValues: number[][] =  input.map((l) => l.split("").map((c) => parseInt(c)))

    return determineShortestPath(heatValues, 4, 10)
}


function determineShortestPath(input: number[][], min: number, max: number): number {
    const discovered = new Set<string>()
    const scores = new Map<string, number>()
    const destination: Coordinate = {x: input[0]!.length - 1, y: input.length - 1}
    const queue: ProcessNode[] = [{x: 0, y: 0, heatLoss: 0, direction: Directions.RIGHT, sameMoveCount: 0}]

    while(queue.length) {
        const current_node = queue.shift()!
        if (current_node.x === destination.x && current_node.y === destination.y) {
            if(current_node.sameMoveCount >= min) return current_node.heatLoss;
            else continue;
        }
        const key = getKeyFromNode(current_node)
        if(discovered.has(key)) continue;
        for(const [direction, diff] of Adjacent.entries()) {
            if(direction === (current_node.direction + 2) % 4) continue;
            if(current_node.direction === direction && current_node.sameMoveCount === max) continue;
            if(current_node.direction !== direction && current_node.sameMoveCount < min) continue;

            const new_y = current_node.y + diff.y
            const new_x = current_node.x + diff.x
            const adjacent_node = input[new_y]?.[new_x]
            if(!adjacent_node) continue;

            const adjacent_move_count = direction === current_node.direction ? current_node.sameMoveCount + 1 : 1
            const adjacent_key = getKeyFromNode({x: new_x, y: new_y, sameMoveCount: adjacent_move_count, direction})
            if(discovered.has(adjacent_key)) continue;

            const heatLoss = adjacent_node + current_node.heatLoss

            const curr_value = scores.get(adjacent_key)
            if(!curr_value || curr_value > heatLoss) {
                scores.set(adjacent_key, heatLoss)
            } else continue;

            const insertPosition = queue.findLastIndex((node) => node.heatLoss < heatLoss);

            queue.splice(insertPosition + 1, 0, {
                x: new_x,
                y: new_y,
                heatLoss,
                sameMoveCount: adjacent_move_count,
                direction
            })
        }
        discovered.add(key);
    }

    return 0;
}


function getKeyFromNode(node: Omit<ProcessNode, "heatLoss">) {
    return `${node.x}-${node.y}-${node.direction}-${node.sameMoveCount}`
}

function getDirectionBetweenNodes(NodeA: Coordinate, NodeB: Coordinate): Directions {
    if(NodeA.x < NodeB.x) return Directions.RIGHT
    if(NodeA.x > NodeB.x) return Directions.LEFT
    if(NodeA.y < NodeB.y) return Directions.DOWN
    if(NodeA.y > NodeB.y) return Directions.UP
    throw new Error("Can't get direction between same positions")
}