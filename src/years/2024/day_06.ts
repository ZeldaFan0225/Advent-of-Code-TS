export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    let guardPosition = {x: -1, y: -1}
    let direction = "u";
    const visited = new Set();

    const fields = input.map((i, row) => {
        const fields = i.split("")
        const xpos = fields.indexOf("^")
        if(xpos >= 0) {
            guardPosition.x = xpos
            guardPosition.y = row
            fields[xpos] = "."
            visited.add(`${xpos},${row}`)
        }
        return fields
    })
    const fieldWidth = fields[0]!.length
    
    while(
        (guardPosition.x >= 0 && guardPosition.x < fieldWidth) &&
        (guardPosition.y >= 0 && guardPosition.y < fields.length)
    ) {
        visited.add(`${guardPosition.x},${guardPosition.y}`)
        
        switch(direction) {
            case "u": {
                if(fields[guardPosition.y - 1]?.[guardPosition.x] !== "#") {
                    guardPosition.y--;
                } else {
                    direction = "r";
                    guardPosition.x++
                }
                break;
            }
            case "r": {
                if(fields[guardPosition.y]?.[guardPosition.x + 1] !== "#") {
                    guardPosition.x++;
                } else {
                    direction = "d";
                    guardPosition.y++
                }
                break;
            }
            case "d": {
                if(fields[guardPosition.y + 1]?.[guardPosition.x] !== "#") {
                    guardPosition.y++;
                } else {
                    direction = "l";
                    guardPosition.x--
                }
                break;
            }
            case "l": {
                if(fields[guardPosition.y]?.[guardPosition.x - 1] !== "#") {
                    guardPosition.x--;
                } else {
                    direction = "u";
                    guardPosition.y--
                }
                break;
            }
        }
    }
    
    return visited.size
}



export function part_2(input: string[]): number {
    let guardPosition = {x: -1, y: -1}
    let direction = "u";
    let loops = 0;

    const fields = input.map((i, row) => {
        const fields = i.split("")
        const xpos = fields.indexOf("^")
        if(xpos >= 0) {
            guardPosition.x = xpos
            guardPosition.y = row
        }
        return fields
    })
    const fieldWidth = fields[0]!.length
    
    while(
        (guardPosition.x >= 0 && guardPosition.x < fieldWidth) &&
        (guardPosition.y >= 0 && guardPosition.y < fields.length)
    ) {
        let prevPos = {x: guardPosition.x, y: guardPosition.y}
        
        switch(direction) {
            case "u": {
                if(
                    fields[prevPos.y]![prevPos.x] === "r" ||
                    getIsLoopable(fields[prevPos.y]!.slice(prevPos.x), "d")
                ) {
                    console.log("loopable")
                    loops++;
                }

                if(fields[guardPosition.y - 1]?.[guardPosition.x] !== "#") {
                    guardPosition.y--;
                } else {
                    direction = "r";
                    guardPosition.x++
                }
                break;
            }
            case "r": {
                if(
                    fields[prevPos.y]![prevPos.x] === "d" ||
                    getIsLoopable(getColumn(fields, prevPos.x, prevPos.y), "l")
                ) {
                    console.log("loopable")
                    loops ++;
                }
                if(fields[guardPosition.y]?.[guardPosition.x + 1] !== "#") {
                    guardPosition.x++;
                } else {
                    direction = "d";
                    guardPosition.y++
                }
                break;
            }
            case "d": {
                if(
                    fields[prevPos.y]![prevPos.x] === "l" ||
                    getIsLoopable(fields[prevPos.y]!.slice(0, prevPos.x).reverse(), "u")
                ) {
                    console.log("loopable")
                    loops ++;
                }
                if(fields[guardPosition.y + 1]?.[guardPosition.x] !== "#") {
                    guardPosition.y++;
                } else {
                    direction = "l";
                    guardPosition.x--
                }
                break;
            }
            case "l": {
                if(
                    fields[prevPos.y]![prevPos.x] === "u" ||
                    getIsLoopable(getColumn(fields, prevPos.x, 0, prevPos.y).reverse(), "r")
                ) {
                    console.log("loopable")
                    loops ++;
                }
                if(fields[guardPosition.y]?.[guardPosition.x - 1] !== "#") {
                    guardPosition.x--;
                } else {
                    direction = "u";
                    guardPosition.y--
                }
                break;
            }
        }

        fields[prevPos.y]![prevPos.x] = direction;
        console.log(fields.map(a => a.join("")).join("\n"))
        console.log("")
    }
    
    return loops
}
// 600 too low
// 1212 too low
// 1714 too high
// not 1518

function getColumn(fields: string[][], x: number, start: number, end?: number) {
    return fields.map(f => f[x]!).slice(start, end)
}

function getIsLoopable(subArray: string[], neededDirection: "u" | "r" | "d" | "l") {
    //console.log(subArray)
    let loopable = false
    let needBlock = false
    for(let char of subArray) {
        if(char === "#") {
            loopable = needBlock;
            break;
        }
        needBlock = false;
        if(char === neededDirection) {
            needBlock = true;
        }
    }
    if(loopable) console.log(neededDirection, subArray)
    return loopable
}