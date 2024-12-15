export const INPUT_SPLIT = "\n\n";
export function part_1(input: string[], visualize?: boolean): number {
    const [raw_grid, raw_movements] = input as [string, string]
    const grid = raw_grid.split("\n").map(row => row.split(""))
    const movements = raw_movements.replaceAll("\n", "").split("")

    const walls = new Set<string>()
    let robot: [number, number] = [-1, -1]
    const boxes = new Set<string>()

    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y]!.length; x++) {
            const char = grid[y]![x]!
            if(char === "#") walls.add(`${x},${y}`)
            if(char === "@") robot = [x, y]
            if(char === "O") boxes.add(`${x},${y}`)
        }
    }

    if(visualize) printGridP1(robot, walls, boxes, grid[0]!.length, grid.length)
    for(const instruction of movements) {
        robot = moveRobotP1(robot, walls, boxes, instruction)
        if(visualize) printGridP1(robot, walls, boxes, grid[0]!.length, grid.length)
    }

    return calculateScore(boxes)
}

function moveRobotP1(robot: [number, number], walls: Set<string>, boxes: Set<string>, direction: string): [number, number] {
    const [x, y] = robot
    const newX = direction === "<" ? x - 1 : direction === ">" ? x + 1 : x
    const newY = direction === "^" ? y - 1 : direction === "v" ? y + 1 : y

    if(walls.has(`${newX},${newY}`)) return robot
    if(boxes.has(`${newX},${newY}`)) {
        const moved = moveBoxP1([newX, newY], walls, boxes, direction)
        if(!moved) return robot
    }

    return [newX, newY]
}

function moveBoxP1(box: [number, number], walls: Set<string>, boxes: Set<string>, direction: string) {
    const [x, y] = box
    const newX = direction === "<" ? x - 1 : direction === ">" ? x + 1 : x
    const newY = direction === "^" ? y - 1 : direction === "v" ? y + 1 : y

    if(walls.has(`${newX},${newY}`)) return false
    if(boxes.has(`${newX},${newY}`)) {
        const moved = moveBoxP1([newX, newY], walls, boxes, direction)
        if(!moved) return false
    }
    boxes.delete(`${x},${y}`)
    boxes.add(`${newX},${newY}`)
    return true
}

function calculateScore(boxes: Set<string>) {
    let score = 0
    for(const box of boxes) {
        const [x, y] = box.split(",").map(Number) as [number, number]
        score += 100 * y + x
    }
    return score
}


function printGridP1(robot: [number, number], walls: Set<string>, boxes: Set<string>, width: number, height: number) {
    for(let y = 0; y < height; y++) {
        let row = ""
        for(let x = 0; x < width; x++) {
            const pos = `${x},${y}`
            if(walls.has(pos)) row += "#"
            else if(boxes.has(pos)) row += "O"
            else if(robot[0] === x && robot[1] === y) row += "@"
            else row += "."
        }
        console.log(row)
    }
    console.log("")
}





export function part_2(input: string[], visualize?: boolean): number {
    const [raw_grid, raw_movements] = input as [string, string]
    const grid = raw_grid.split("\n").map(row => row.split(""))
    const movements = raw_movements.replaceAll("\n", "").split("")

    const walls = new Set<string>()
    let robot: [number, number] = [-1, -1]
    const boxes = new Set<string>()

    for(let y = 0; y < grid.length; y++) {
        // convert the input as per part 2 instructions
        for(let x = 0; x < grid[y]!.length; x++) {
            const char = grid[y]![x]!
            if(char === "#") grid[y]![x] = "##"
            if(char === "@") grid[y]![x] = "@."
            if(char === "O") grid[y]![x] = "[]"
            if(char === ".") grid[y]![x] = ".."
        }
        grid[y] = grid[y]!.join("").split("")
        for(let x = 0; x < grid[y]!.length; x++) {
            const char = grid[y]![x]!
            if(char === "[") boxes.add(`${x},${y}`)
            if(char === "@") robot = [x, y]
            if(char === "#") walls.add(`${x},${y}`)
        }
    }

    if(visualize) printGridP2(robot, walls, boxes, grid[0]!.length, grid.length)
    for(const instruction of movements) {
        robot = moveRobotP2(robot, walls, boxes, instruction)
        if(visualize) printGridP2(robot, walls, boxes, grid[0]!.length, grid.length, instruction)
    }

    return calculateScore(boxes)
}

function moveRobotP2(robot: [number, number], walls: Set<string>, boxes: Set<string>, direction: string): [number, number] {
    const [x, y] = robot
    const newX = direction === "<" ? x - 1 : direction === ">" ? x + 1 : x
    const newY = direction === "^" ? y - 1 : direction === "v" ? y + 1 : y

    if(walls.has(`${newX},${newY}`)) return robot
    if(boxes.has(`${newX},${newY}`)) {
        const moves = moveBoxP2([newX, newY], walls, boxes, direction)
        if(!moves.length) return robot
        else {
            // execute instructions if the robot can move the box
            for(const move of moves) {
                const [from, to] = move
                boxes.delete(from)
                boxes.add(to)
            }
        }
    } else if(boxes.has(`${newX-1},${newY}`)) {
        const moves = moveBoxP2([newX-1, newY], walls, boxes, direction)
        if(!moves.length) return robot
        else {
            // execute instructions if the robot can move the box
            for(const move of moves) {
                const [from, to] = move
                boxes.add(to)
                boxes.delete(from)
            }
        }
    }

    return [newX, newY]
}

function moveBoxP2(box: [number, number], walls: Set<string>, boxes: Set<string>, direction: string): [string, string][] {
    const [x, y] = box
    let moves: [string, string][] = []
    switch (direction) {
        case "^": {
            if(walls.has(`${x},${y-1}`) || walls.has(`${x + 1},${y-1}`)) return []
            if(boxes.has(`${x},${y-1}`)) {
                const moved = moveBoxP2([x, y-1], walls, boxes, direction)
                if(!moved.length) return []
                else moves.push(...moved)
            } else {
                if(boxes.has(`${x - 1},${y-1}`)) {
                    const moved = moveBoxP2([x - 1, y-1], walls, boxes, direction)
                    if(!moved.length) return []
                    else moves.push(...moved)
                }
                if(boxes.has(`${x + 1},${y-1}`)) {
                    const moved = moveBoxP2([x + 1, y-1], walls, boxes, direction)
                    if(!moved.length) return []
                    else moves.push(...moved)
                }
            }
            moves.push([`${x},${y}`, `${x},${y-1}`])
            break;
        }
        case "<": {
            if(walls.has(`${x-1},${y}`)) return []
            if(boxes.has(`${x-2},${y}`)) {
                const moved = moveBoxP2([x-2, y], walls, boxes, direction)
                if(!moved.length) return []
                else moves.push(...moved)
            }
            moves.push([`${x},${y}`, `${x-1},${y}`])
            break;
        }
        case "v": {
            if(walls.has(`${x},${y+1}`) || walls.has(`${x + 1},${y+1}`)) return []
            if(boxes.has(`${x},${y+1}`)) {
                const moved = moveBoxP2([x, y+1], walls, boxes, direction)
                if(!moved.length) return []
                else moves.push(...moved)
            } else {
                if(boxes.has(`${x + 1},${y+1}`)) {
                    const moved = moveBoxP2([x + 1, y+1], walls, boxes, direction)
                    if(!moved.length) return []
                    else moves.push(...moved)
                }
                if(boxes.has(`${x - 1},${y+1}`)) {
                    const moved = moveBoxP2([x - 1, y+1], walls, boxes, direction)
                    if(!moved.length) return []
                    else moves.push(...moved)
                }
            }
            moves.push([`${x},${y}`, `${x},${y+1}`])
            break;
        }
        case ">": {
            if(walls.has(`${x+2},${y}`)) return []
            if(boxes.has(`${x+2},${y}`)) {
                const moved = moveBoxP2([x+2, y], walls, boxes, direction)
                if(!moved.length) return []
                else moves.push(...moved)
            }
            moves.push([`${x},${y}`, `${x+1},${y}`])
            break;
        }
    }

    return moves
}


function printGridP2(robot: [number, number], walls: Set<string>, boxes: Set<string>, width: number, height: number, direction: string  = "") {
    console.log(direction)
    for(let y = 0; y < height; y++) {
        let row = ""
        for(let x = 0; x < width; x++) {
            const pos = `${x},${y}`
            if(walls.has(pos)) row += "#"
            else if(boxes.has(pos)) { row += "[]"; x++ }
            else if(robot[0] === x && robot[1] === y) row += "@"
            else row += "."
        }
        console.log(row)
    }
    console.log("")
}