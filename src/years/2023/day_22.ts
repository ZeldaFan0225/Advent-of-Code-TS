interface Coordinate {
    x: number,
    y: number,
    z: number,
}

interface Brick {
    start: Coordinate,
    end: Coordinate,
    // index of supporting brick in list
    supported_by: number[],
    supporting: number[]
}

const COORDINATE_REGEX = /(?<x1>\d+),(?<y1>\d+),(?<z1>\d+)~(?<x2>\d+),(?<y2>\d+),(?<z2>\d+)/
export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const coordinates = parseCoordinates(input)
    const fallen = letThemFall(coordinates)
    const disintegratable = determineDisintegratableBlocks(fallen)
    return disintegratable
}


export function part_2(input: string[]): number {
    const coordinates = parseCoordinates(input)
    const fallen = letThemFall(coordinates)
    const mostfalling = determineMostFalling(fallen)
    return mostfalling
}

function determineMostFalling(bricks: Brick[]) {
    let total = 0
    for(let brick of bricks) {
        total += getBricksFalling(bricks, brick)
    }
    return total
}

function getBricksFalling(bricks: Brick[], brick: Brick) {
    const queue = brick.supporting.filter(s => bricks[s]!.supported_by.length === 1)
    let counter = 0
    const fallen = new Set<number>()
    while(queue.length) {
        const i = queue.shift()!
        const b = bricks[i]
        if(!b) throw new Error("Invalid bricks")
        fallen.add(i)
        const new_bricks = b.supporting.filter(s => bricks[s]!.supported_by.filter(n => !fallen.has(n)).length === 0)
        for(let nb of new_bricks) {
            if(!queue.includes(nb)) queue.push(nb)
        }
        counter++
    }
    return counter
}

function determineDisintegratableBlocks(bricks: Brick[]) {
    let counter = 0
    const canbedestroyed = new Set<number>()
    const cannotbedestroyed = new Set<number>()
    for(let brick of bricks) {
        if(brick.supporting.length) {
            const doesntfullysupport = brick.supporting.every(s => bricks[s]!.supported_by.length >= 2)
            if(doesntfullysupport) canbedestroyed.add(bricks.indexOf(brick))
            else cannotbedestroyed.add(bricks.indexOf(brick))
        } else {
            canbedestroyed.add(bricks.indexOf(brick))
        }
    }
    for(let b of canbedestroyed.values()) {
        if(!cannotbedestroyed.has(b)) counter += 1
    }
    return counter
}

function parseCoordinates(input: string[]) {
    const bricks: Brick[] = []
    for(let line of input) {
        const {x1, y1, z1, x2, y2, z2} = COORDINATE_REGEX.exec(line)!.groups as any

        bricks.push({
            start: {x: parseInt(x1), y: parseInt(y1), z: parseInt(z1)},
            end: {x: parseInt(x2), y: parseInt(y2), z: parseInt(z2)},
            supported_by: [],
            supporting: []
        })
    }
    return bricks
}


// TODO: optimize when bored
function letThemFall(bricks: Brick[]) {
    let fallen = true
    let register_supporting = false
    while(fallen) {
        fallen = false
        for(let brick of bricks) {
            if(brick.start.z === 1) continue;
            const supported_by = bricks.filter(b => checkIfDirectlyAbove(brick, b))
            if(!supported_by.length) {
                brick.start.z -= 1
                brick.end.z -= 1
                fallen = true
            }
            if(register_supporting) {
                brick.supported_by = supported_by.map(b => {
                    b.supporting.push(bricks.indexOf(brick))
                    return bricks.indexOf(b)
                })
            }
        }

        if(!fallen && !register_supporting) {
            fallen = true
            register_supporting = true
        }else if(register_supporting) {
            fallen = false
        }
    }

    return bricks
}

function checkIfDirectlyAbove(above: Brick, below: Brick) {
    return (above.start.z - 1 === below.end.z) &&
        ((above.start.x <= below.end.x && below.end.x <= above.end.x) || (above.end.x >= below.start.x && above.end.x <= below.end.x)) &&
        ((above.start.y <= below.end.y && below.end.y <= above.end.y) || (above.end.y >= below.start.y && above.end.y <= below.end.y))
}