import { appendFileSync } from "fs";

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

type Direction = "u" | "r" | "d" | "l"

// FUCK MEMORY USAGE
export function part_2(input: string[]): number {
    let guardPosition = {x: -1, y: -1}

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

    let loops = 0
    
    function emulateGuard(x: number, y: number, direction: Direction, visited: string[][], alreadyPlacedBlock: boolean) {
        if(
            visited[y] === undefined ||
            visited[y]?.[x] === undefined ||
            visited[y]?.[x] === " "
        ) {
            return
        }
        
        //printVisited(visited, loops)
        
        if(visited[y]?.[x] === "#") {
            switch(direction) {
                case "u": visited[y+1]![x] = "r"; y++; x++; direction = "r"; break;
                case "r": visited[y]![x-1] = "d"; y++; x--; direction = "d"; break;
                case "d": visited[y-1]![x] = "l"; y--; x--; direction = "l"; break;
                case "l": visited[y]![x+1] = "u"; y--; x++; direction = "u"; break;
            }
        } else {
            switch(direction) {
                case "u": {
                    if(visited[y]?.[x] === "r") {
                        if(alreadyPlacedBlock) {
                            if(visited[y-1]?.[x] === "#") {
                                loops++
                                return;
                            }
                        } else {
                            loops++
                        }
                    } else if(visited[y]?.[x] === "u") {
                        loops++
                        return;
                    } else if(!alreadyPlacedBlock && visited[y-1]?.[x] !== "#" && visited[y]?.slice(x).includes("#")) {
                        const clone = structuredClone(visited)
                        clone[y]![x] = "r"
                        emulateGuard(x+1, y, "r", clone, true)
                    }
                    visited[y]![x] = direction
                    y--;
                    break;
                }
                case "r": {
                    if(visited[y]?.[x] === "d") {
                        if(alreadyPlacedBlock) {
                            if(visited[y]?.[x+1] === "#") {
                                loops++
                                return;
                            }
                        } else {
                            loops++
                        }
                    } else if(visited[y]?.[x] === "r") {
                        loops++
                        return;
                    } else if(!alreadyPlacedBlock && visited[y]![x+1] !== "#" && getColumn(visited, x, y).includes("#")) {
                        const clone = structuredClone(visited)
                        clone[y]![x] = "d"
                        emulateGuard(x, y+1, "d", clone, true)
                    }
                    visited[y]![x] = direction
                    x++;
                    break;
                }
                case "d": {
                    if(visited[y]?.[x] === "l") {
                        if(alreadyPlacedBlock) {
                            if(visited[y+1]?.[x] === "#") {
                                loops++
                                return;
                            }
                        } else {
                            loops++
                        }
                    } else if(visited[y]?.[x] === "d") {
                        loops++
                        return;
                    } else if(!alreadyPlacedBlock && visited[y+1]?.[x] !== "#" && visited[y]?.slice(0, x).includes("#")) {
                        const clone = structuredClone(visited)
                        clone[y]![x] = "l"
                        emulateGuard(x-1, y, "l", clone, true)
                    }
                    visited[y]![x] = direction
                    y++;
                    break;
                }
                case "l": {
                    if(visited[y]?.[x] === "u") {
                        if(alreadyPlacedBlock) {
                            if(visited[y]?.[x-1] === "#") {
                                loops++
                                return;
                            }
                        } else {
                            loops++
                        }
                    } else if(visited[y]?.[x] === "l") {
                        loops++
                        return;
                    } else if(!alreadyPlacedBlock && visited[y]![x-1] !== "#" && getColumn(visited, x, 0, y).includes("#")) {
                        const clone = structuredClone(visited)
                        clone[y]![x] = "u"
                        emulateGuard(x, y-1, "u", clone, true)
                    }
                    visited[y]![x] = direction
                    x--;
                    break;
                }
            }
        }

        emulateGuard(x, y, direction, structuredClone(visited), alreadyPlacedBlock)
    }

    emulateGuard(guardPosition.x, guardPosition.y, "u", fields, false)

    return loops
}

// 600 too low
// 1212 too low
// 1714 too high
// not 1518
// not 905
// not 1249
// not 1231

function getColumn(fields: string[][], x: number, start: number, end?: number) {
    return fields.map(f => f[x]!).slice(start, end)
}

function printVisited(visited: string[][], loopcount: number) {
    // write it to a txt file
    appendFileSync("visited.txt", visited.map(r => r.join("")).join("\n") + "\n" + loopcount + "\n\n")
    //console.log("")
    //console.log(visited.map(r => r.join("")).join("\n"))
}