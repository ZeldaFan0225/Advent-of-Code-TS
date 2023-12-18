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
    const commands = parseCommandsPart1(input)
    return executeCommands(commands)
}


export function part_2(input: string[]): number {
    const commands = parseCommandsPart2(input)
    console.log(commands)
    return executeCommands(commands)
}

function parseCommandsPart1(input: string[]) {
    const commands: CommandData[] = []
    for(let command of input) {
        const match = regex.exec(command)?.slice(1)
        if(!match) throw new Error("Invalid Input")
        const [direction, count] = match as [string, string]
        commands.push({
            direction: getDirectionFromString(direction),
            count: parseInt(count)
        })
    }
    return commands
}

function parseCommandsPart2(input: string[]) {
    const commands: CommandData[] = []
    for(let command of input) {
        const match = regex.exec(command)
        if(!match) throw new Error("Invalid Input")
        const color = match[3]!
        commands.push({
            direction: getPart2Directions(color),
            count: Number(`0x${color.slice(0, 5)}`)
        })
    }
    return commands
}

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
function getDirectionFromString(str: string) {
    switch(str) {
        case "U": return Directions.UP;
        case "D": return Directions.DOWN;
        case "L": return Directions.LEFT;
        case "R": return Directions.RIGHT;
        default: throw new Error("Invalid Input")
    }
}

function getNewCoordinates(previous: {x: number, y: number}, direction: Directions) {
    switch(direction) {
        case Directions.UP: return {...previous, y: previous.y - 1};
        case Directions.DOWN: return {...previous, y: previous.y + 1};
        case Directions.LEFT: return {...previous, x: previous.x - 1};
        case Directions.RIGHT: return {...previous, x: previous.x + 1};
    }
}

function getBorderDirection(direction: Directions): Directions {
    return (direction + 3) % 4;
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