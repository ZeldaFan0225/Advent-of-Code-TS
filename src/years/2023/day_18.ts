enum Directions {
    UP, RIGHT, DOWN, LEFT
}
interface CommandData {
    direction: Directions,
    count: number
}

interface TileData {
    borders: Directions[]
    x: number,
    y: number,
    direction: Directions
}

type NonPerimeterTile = Omit<TileData, "direction" | "colors"> & {perimeter: false}

export const INPUT_SPLIT = "\n";
const regex = /([LRDU]) (\d+) \(#([0-9a-f]{6})\)/
export function part_1(input: string[]): number {
    const commands = parseCommands(input, 1)
    return processCommands(commands)
}


export function part_2(input: string[]): number {
    const commands = parseCommands(input, 2)
    return processCommands(commands)
}

function parseCommands(input: string[], part: 1 | 2) {
    const commands: CommandData[] = []
    for(let command of input) {
        const match = regex.exec(command)?.slice(1)
        if(!match) throw new Error("Invalid Input")
        const [direction, count, color] = match as [string, string, string]
        if(part === 1) {
            commands.push({
                direction: getDirectionFromString(direction),
                count: parseInt(count)
            })
        } else if(part === 2) {
            commands.push({
                direction: getPart2Directions(color),
                count: Number(`0x${color.slice(0, 5)}`)
            })
        }
    }
    return commands
}


function getPart2Directions(color: string) {
    switch(color.slice(-1)) {
        case "0": return Directions.RIGHT;
        case "1": return Directions.DOWN;
        case "2": return Directions.LEFT;
        case "3": return Directions.UP;
        default: throw new Error("Invalid Input")
    }
}



// shoelace formula https://en.wikipedia.org/wiki/Shoelace_formula
function processCommands(commands: CommandData[]): number {
    let area = 0
    let borders = 0
    let previous_position = {x: 0, y: 0}
    for(let command of commands) {
        borders += command.count
        const new_position = getNewCoordinates(previous_position, command.direction, command.count)
        area += previous_position.x * new_position.y
        area -= previous_position.y * new_position.x
        previous_position = new_position
    }

    area = Math.abs(area) / 2
    return area + 0.5 * borders + 1
}


function getNewCoordinates(previous: {x: number, y: number}, direction: Directions, count = 1) {
    switch(direction) {
        case Directions.UP: return {...previous, y: previous.y - count};
        case Directions.DOWN: return {...previous, y: previous.y + count};
        case Directions.LEFT: return {...previous, x: previous.x - count};
        case Directions.RIGHT: return {...previous, x: previous.x + count};
    }
}

function getDirectionFromString(str: string) {
    switch(str) {
        case "U": return Directions.UP;
        case "D": return Directions.DOWN;
        case "L": return Directions.LEFT;
        case "R": return Directions.RIGHT;
        default: throw new Error("Invalid Input")
    }
}

/*
HALL OF SHAME OR LEARNING

function executeCommands(commands: CommandData[]) {
    let max = {x:0,y:0}
    let min = {x:0,y:0}
    const perimeter_tiles: TileData[] = []
    let previous_coords = {x: 0, y: 0}
    let command_i = 0
    for(let command of commands) {
        for(let i = 0; i < command.count; i++) {
            let colors: Partial<Record<Directions, number>> = {}
            let borders: Directions[] = []

            borders.push(getBorderDirection(command.direction))

            // for last tile in row; check upcoming color and direction
            const upcoming = commands[command_i + 1]
            if(i === command.count - 1 && upcoming) {
                // if right turn
                if((command.direction + 1) % 4 === upcoming.direction) {
                    borders.push(getBorderDirection(upcoming.direction))
                // if left turn; discard any colors because the tile is not at the perimeter
                } else if((command.direction + 3) % 4 === upcoming.direction) {
                    borders = []
                }
            }

            previous_coords = getNewCoordinates(previous_coords, command.direction)
            if(previous_coords.x < min.x) min.x = previous_coords.x
            if(previous_coords.x > max.x) max.x = previous_coords.x
            if(previous_coords.y < min.y) min.y = previous_coords.y
            if(previous_coords.y > max.y) max.y = previous_coords.y
            perimeter_tiles.push({
                ...previous_coords,
                direction: command.direction,
                borders
            })
        }
        command_i++
    }
    const last_tile = perimeter_tiles.at(-1)!
    last_tile.borders.push(getBorderDirection(perimeter_tiles[0]!.direction))

    // shift coordinates around to make x >= 0 and y >= 0
    if(min.x < 0) {
        perimeter_tiles.forEach(t => t.x -= min.x)
    }
    if(min.y < 0) {
        perimeter_tiles.forEach(t => t.y -= min.y)
    }
    const width = max.x - min.x + 1
    const height = max.y - min.y + 1

    const tiles: Record<number, Record<number, (NonPerimeterTile | TileData)>> = {}
    for(let tile of perimeter_tiles) {
        if(!tiles[tile.y]) tiles[tile.y] = {}
        tiles[tile.y]![tile.x] = tile
    }

    let isinside = false
    let count = 0
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            const tile = tiles[i]?.[j]
            if(tile) {
                if(tile.borders.includes(Directions.LEFT)) isinside = true;
                if(tile.borders.includes(Directions.RIGHT)) isinside = false;
                count++;
                continue;
            }
            if(isinside) {
                count++
            }
        }
        isinside = false
    }

    return count
}


// Util functions
function getBorderDirection(direction: Directions): Directions {
    return (direction + 3) % 4;
}*/