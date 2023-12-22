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

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const coordinates = parseCoordinates(input)
    const fallen = letThemFall(coordinates)
    const disintegratable = determineDisintegratableBlocks(fallen)
    console.log(fallen)
    return disintegratable
}


export function part_2(input: string): number {
return input.length
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
    console.log(cannotbedestroyed)
    console.log(canbedestroyed)
    for(let b of canbedestroyed.values()) {
        if(!cannotbedestroyed.has(b)) counter += 1
    }
    return counter
}

function parseCoordinates(input: string[]) {
    const bricks: Brick[] = []
    for(let line of input) {
        const [coord_1, coord_2] = line.split("~") as [string, string]
        const [x1,y1,z1] = coord_1.split(",").map(c => parseInt(c)) as [number, number, number]
        const [x2,y2,z2] = coord_2.split(",").map(c => parseInt(c)) as [number, number, number]

        bricks.push({
            start: {x: x1, y: y1, z: z1},
            end: {x: x2, y: y2, z: z2},
            supported_by: [],
            supporting: []
        })
    }
    return bricks
}

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