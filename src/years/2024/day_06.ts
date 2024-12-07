import { appendFileSync } from "fs";

type Direction = "u" | "r" | "d" | "l"
type Position = { x: number; y: number }

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    let guardPosition = {x: -1, y: -1}
    const visited = new Set();

    const fields = input.map((i, row) => {
        const fields = i.split("")
        const xpos = fields.indexOf("^")
        if(xpos >= 0) {
            guardPosition.x = xpos
            guardPosition.y = row
            fields[xpos] = "."
        }
        return fields
    })
    
    function emulateGuard(x: number, y: number, direction: "u" | "r" | "d" | "l") {
        if(
            fields[y] === undefined ||
            fields[y]?.[x] === undefined ||
            fields[y]?.[x] === " "
        ) {
            return
        }
        
        if(fields[y]?.[x] === "#") {
            switch(direction) {
                case "u": y++; x++; direction = "r"; break;
                case "r": y++; x--; direction = "d"; break;
                case "d": y--; x--; direction = "l"; break;
                case "l": y--; x++; direction = "u"; break;
            }
        } else {
            visited.add(`${x},${y}`)
            switch(direction) {
                case "u": y--; break;
                case "r": x++; break;
                case "d": y++; break;
                case "l": x--; break;
            }
        }

        emulateGuard(x, y, direction)
    }

    emulateGuard(guardPosition.x, guardPosition.y, "u")

    return visited.size
}

// FUCK MEMORY USAGE
export function part_2(input: string[]): number {
    // Parse initial state
    let guardPosition = { x: -1, y: -1 }
    const obstacles = new Set<string>()
    
    // Convert input to map of obstacles and find guard
    const height = input.length
    const width = input[0]!.length
    
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y]!.length; x++) {
            if (input[y]![x] === "^") {
                guardPosition = { x, y }
            } else if (input[y]![x] === "#") {
                obstacles.add(`${x},${y}`)
            }
        }
    }

    // Get initial path
    function getInitialPath(): Set<string> {
        const visited = new Set<string>()
        let pos = { ...guardPosition }
        let dir: Direction = "u"
        
        while (true) {
            // Calculate next position
            const nextPos = getNextPosition(pos, dir)
            
            // Check if guard left map
            if (!isInBounds(nextPos, width, height)) {
                break
            }
            
            // If obstacle ahead, turn right
            if (obstacles.has(`${nextPos.x},${nextPos.y}`)) {
                dir = turnRight(dir)
            } else {
                pos = nextPos
                visited.add(`${pos.x},${pos.y}`)
            }
        }
        
        return visited
    }

    // Check for loops with added obstacle
    function checkForLoop(testPos: Position): boolean {
        const testObstacle = `${testPos.x},${testPos.y}`
        const visitedStates = new Set<string>()
        let pos = { ...guardPosition }
        let dir: Direction = "u"
        
        while (true) {
            // Calculate next position
            const nextPos = getNextPosition(pos, dir)
            
            // Check if guard left map
            if (!isInBounds(nextPos, width, height)) {
                return false
            }
            
            // If obstacle ahead (including test obstacle)
            if (obstacles.has(`${nextPos.x},${nextPos.y}`) || `${nextPos.x},${nextPos.y}` === testObstacle) {
                // Check for loop while turning
                const state = `${pos.x},${pos.y},${dir}`
                if (visitedStates.has(state)) {
                    return true
                }
                visitedStates.add(state)
                dir = turnRight(dir)
            } else {
                pos = nextPos
            }
        }
    }

    // Main solution
    const initialPath = getInitialPath()
    let validPositions = 0

    // Test each position from initial path
    for (const posStr of initialPath) {
        const [x, y] = posStr.split(",").map(Number)
        if (checkForLoop({ x: x!, y: y! })) {
            validPositions++
        }
    }

    return validPositions
}

// Helper functions
function getNextPosition(pos: Position, dir: Direction): Position {
    switch (dir) {
        case "u": return { x: pos.x, y: pos.y - 1 }
        case "r": return { x: pos.x + 1, y: pos.y }
        case "d": return { x: pos.x, y: pos.y + 1 }
        case "l": return { x: pos.x - 1, y: pos.y }
    }
}

function turnRight(dir: Direction): Direction {
    switch (dir) {
        case "u": return "r"
        case "r": return "d"
        case "d": return "l"
        case "l": return "u"
    }
}

function isInBounds(pos: Position, width: number, height: number): boolean {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height
}