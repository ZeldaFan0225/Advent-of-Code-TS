export const INPUT_SPLIT = "\n";
interface Coordinate {
    x: number,
    y: number
}
interface Tile extends Coordinate {
    tile: string,
    discovered_from: Set<Direction>
}
interface StartPosition extends Coordinate {
    enter_from: Direction
}
enum Direction {
    UP, RIGHT, DOWN, LEFT
}
const energized_tiles: Set<string> = new Set()
export function part_1(input: string[], visualize?: boolean): number {
    const tiles: Tile[][] = input.map((r, y) => r.split("").map((t, x) => ({x,y,tile:t, discovered_from: new Set()})))
    simulateBeam(tiles, {x:0,y:0}, Direction.LEFT)
    if(visualize) printEnergized(tiles);
    return energized_tiles.size
}


export function part_2(input: string[], visualize?: boolean): number {

    const start_positions: StartPosition[] = []
    for(let i = 0; i < input.length; i++) {
        if(i === 0 || i === (input.length - 1)) {
            for(let j = 0; j < input[0]!.length; j++) {
                if(i === 0) {
                    start_positions.push({x: j, y: i, enter_from: Direction.DOWN})
                }
                if(i === input.length -1) {
                    start_positions.push({x: j, y: i, enter_from: Direction.UP})
                }
            }
        }
        start_positions.push({x: 0, y: i, enter_from: Direction.LEFT}, {x: input[0]!.length - 1, y: i, enter_from: Direction.RIGHT})
    }

    let largest = 0
    for(let start_position of start_positions) {
        const tiles: Tile[][] = input.map((r, y) => r.split("").map((t, x) => ({x,y,tile:t, discovered_from: new Set()})))
        simulateBeam(tiles, start_position, start_position.enter_from)
        if(energized_tiles.size > largest) largest = energized_tiles.size
        if(visualize) printEnergized(tiles);
        energized_tiles.clear()
    }

    return largest;
}

function simulateBeam(tiles: Tile[][], position: Coordinate, incoming_direction: Direction): void {
    if(position.x < 0 || position.y < 0 || position.x > (tiles[0]!.length - 1) || position.y > (tiles.length - 1)) return;

    // check if tile has alredy been simulated from incoming distance, result would be the same
    const tile = tiles[position.y]?.[position.x]
    if(tile?.discovered_from.has(incoming_direction)) return;
    tile?.discovered_from.add(incoming_direction)
    energized_tiles.add(`${position.x}-${position.y}`)

    switch(tile?.tile) {
        default: return;
        case ".": {
            const next = {
                x: position.x + (incoming_direction === Direction.RIGHT ? -1 : incoming_direction === Direction.LEFT ? 1 : 0),
                y: position.y + (incoming_direction === Direction.UP ? -1 : incoming_direction === Direction.DOWN ? 1 : 0)
            }
            simulateBeam(tiles, next, incoming_direction);
            return;
        }
        case "-" : {
            if(incoming_direction === Direction.LEFT || incoming_direction === Direction.RIGHT) {
                const next = {
                    x: position.x + (incoming_direction === Direction.RIGHT ? -1 : incoming_direction === Direction.LEFT ? 1 : 0),
                    y: position.y
                }
                simulateBeam(tiles, next, incoming_direction);
                return;
            } else {
                const next1 = {
                    x: position.x + 1,
                    y: position.y
                }
                const next2 = {
                    x: position.x - 1,
                    y: position.y
                }
                simulateBeam(tiles, next1, Direction.LEFT);
                simulateBeam(tiles, next2, Direction.RIGHT);
                return;
            }
        }
        case "|" : {
            if(incoming_direction === Direction.UP || incoming_direction === Direction.DOWN) {
                const next = {
                    x: position.x,
                    y: position.y + (incoming_direction === Direction.UP ? -1 : incoming_direction === Direction.DOWN ? 1 : 0)
                }
                simulateBeam(tiles, next, incoming_direction);
                return;
            } else {
                const next1 = {
                    x: position.x,
                    y: position.y + 1
                }
                const next2 = {
                    x: position.x,
                    y: position.y - 1
                }
                simulateBeam(tiles, next1, Direction.DOWN);
                simulateBeam(tiles, next2, Direction.UP);
                return;
            }
        }
        case "/": {
            if(incoming_direction === Direction.LEFT) {
                const next = {
                    x: position.x,
                    y: position.y - 1
                }
                simulateBeam(tiles, next, Direction.UP);
            } else if(incoming_direction === Direction.RIGHT) {
                const next = {
                    x: position.x,
                    y: position.y + 1
                }
                simulateBeam(tiles, next, Direction.DOWN);
            } else if(incoming_direction === Direction.UP) {
                const next = {
                    x: position.x + 1,
                    y: position.y
                }
                simulateBeam(tiles, next, Direction.LEFT);
            } else if(incoming_direction === Direction.DOWN) {
                const next = {
                    x: position.x - 1,
                    y: position.y
                }
                simulateBeam(tiles, next, Direction.RIGHT);
            }
            return;
        }
        case "\\": {
            if(incoming_direction === Direction.LEFT) {
                const next = {
                    x: position.x,
                    y: position.y + 1
                }
                simulateBeam(tiles, next, Direction.DOWN);
            } else if(incoming_direction === Direction.RIGHT) {
                const next = {
                    x: position.x,
                    y: position.y - 1
                }
                simulateBeam(tiles, next, Direction.UP);
            } else if(incoming_direction === Direction.UP) {
                const next = {
                    x: position.x - 1,
                    y: position.y
                }
                simulateBeam(tiles, next, Direction.RIGHT);
            } else if(incoming_direction === Direction.DOWN) {
                const next = {
                    x: position.x + 1,
                    y: position.y
                }
                simulateBeam(tiles, next, Direction.LEFT);
            }
            return;
        }
    }
}

function printEnergized(tiles: Tile[][]) {
    for(let row of tiles) {
        for(let tile of row) {
            if(energized_tiles.has(`${tile.x}-${tile.y}`))
                process.stdout.write("#")
            else
                process.stdout.write(".")
        }
        process.stdout.write("\n")
    }
    process.stdout.write("\n")
}