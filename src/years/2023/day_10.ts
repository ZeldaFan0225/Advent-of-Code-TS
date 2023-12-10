interface Coordinate {
    x: number,
    y: number
}

interface Node {
    position: Coordinate,
    points_to: Coordinate[],
    distance: number,
    discovered: boolean,
    node_char: string
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const {highest} = generateLoop(input)

    return highest
}


export function part_2(input: string[]): number {
    const {nodes} = generateLoop(input)

    //printNetwork(nodes)

    let enclosed_tiles = 0
    for(let row of nodes) {
        let walls = 0
        let required = ""
        for(let node of row) {
            if(node.discovered) {
                switch(node.node_char) {
                    case "-": break;
                    case "|": walls ++; break;
                    case "F": {
                        required = "J";
                        break;
                    }
                    case "L": {
                        required = "7";
                        break;
                    }
                    case "J": {
                        if(required === "J") walls++;
                        required = "";
                        break;
                    }
                    case "7": {
                        if(required === "7") walls++;
                        required = "";
                        break;
                    }
                }
            }
            if(!node.discovered) {
                if(walls % 2 !== 0) enclosed_tiles++
            }
        }
    }

    return enclosed_tiles
}

function getStartPointsTo(start_pos: Coordinate, input: string[]){
    const result = []
    if(start_pos.x > 0 && ["-", "F", "L"].includes(input[start_pos.y]![start_pos.x - 1]!)) result.push({x: start_pos.x - 1, y: start_pos.y})
    if(start_pos.y > 0 && ["|", "7", "F"].includes(input[start_pos.y - 1]![start_pos.x]!)) result.push({x: start_pos.x, y: start_pos.y - 1})
    if(start_pos.x < input[0]!.length && ["-", "7", "J"].includes(input[start_pos.y]![start_pos.x + 1]!)) result.push({x: start_pos.x + 1, y: start_pos.y})
    if(start_pos.y < input.length && ["|", "J", "L"].includes(input[start_pos.y + 1]![start_pos.x]!)) result.push({x: start_pos.x, y: start_pos.y + 1})

    return result
}

/*function printNetwork(nodes: Node[][]): void {
    for(let row of nodes) {
        for(let node of row) {
            //console.log(node)
            if(!node.discovered) process.stdout.write(".")
            else process.stdout.write("#")//node.node_char)
        }
        process.stdout.write("\n")
    }
    console.log("")
}*/

function generateLoop(input: string[]): {nodes: Node[][], start_position: Coordinate, highest: number} {
    const start_position: Coordinate = {x: 0,y: 0}
    let highest = 0
    const nodes = input.map((l, y) => {
        const chars = l.split("")

        return chars.map((c, x) => {
            const data: Node = {
                position: {
                    x,
                    y
                },
                points_to: [],
                distance: 0,
                discovered: false,
                node_char: c
            }

            switch(c) {
                case "|": {
                    if(y < input.length - 1) data.points_to.push({x, y: y+1})
                    if(y > 0) data.points_to.push({x, y: y-1})
                    break;
                }
                case "-": {
                    if(x < l.length - 1) data.points_to.push({x: x+1, y})
                    if(x > 0) data.points_to.push({x: x-1, y})
                    break;
                }
                case "L": {
                    if(x < l.length - 1) data.points_to.push({x: x+1, y})
                    if(y > 0) data.points_to.push({x, y: y-1})
                    break;
                }
                case "F": {
                    if(x < l.length - 1) data.points_to.push({x: x+1, y})
                    if(y < input.length - 1) data.points_to.push({x, y: y+1})
                    break;
                }
                case "7": {
                    if(x > 0) data.points_to.push({x: x-1, y})
                    if(y < input.length - 1) data.points_to.push({x, y: y+1})
                    break;
                }
                case "J": {
                    if(x > 0) data.points_to.push({x: x-1, y})
                    if(y > 0) data.points_to.push({x, y: y-1})
                    break;
                }
                case "S": {
                    start_position.x = x;
                    start_position.y = y;
                    data.discovered = true;
                    data.points_to = getStartPointsTo(start_position, input)
                    break;
                }
            }

            return data
        })
    })

    const queue = [nodes[start_position.y]![start_position.x]!]
    let i = 0
    while(queue.length) {
        i++
        const process_pos = queue.splice(0, 1)[0]
        if(!process_pos) break;

        if(process_pos.distance > highest) highest = process_pos.distance
        nodes[process_pos.position.y]![process_pos.position.x]!.distance = process_pos.distance
        nodes[process_pos.position.y]![process_pos.position.x]!.discovered = true

        for(let adjacent of process_pos.points_to) {
            const adjacent_node = nodes[adjacent.y]![adjacent.x]!
            if(adjacent_node.discovered) continue;
            // if node also points back
            if(adjacent_node.points_to.some(n => n.x === process_pos.position.x && n.y === process_pos.position.y)) {
                adjacent_node.distance = process_pos.distance + 1
                queue.push(adjacent_node)
            }
        }
    }

    return {nodes, start_position, highest}
}