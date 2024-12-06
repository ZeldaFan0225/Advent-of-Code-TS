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



export function part_2(input: string): number {
    return input.length
}
