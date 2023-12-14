export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const platform = input.map(i => i.split(""))

    const rolled = rollRocksToUpDown(platform, "north")
    return calculateWeight(rolled)
}


export function part_2(input: string[]): number {
    let platform = input.map(i => i.split(""))
    const loop = [platform.map(r => r.join("")).join("-")]
    const cycles = 1000000000

    let result = 0
    for(let i = 0; i < cycles; i++) {
        platform = rollRocksToUpDown(platform, "north")
        platform = rollRocksToLeftRight(platform, "west")
        platform = rollRocksToUpDown(platform, "south")
        platform = rollRocksToLeftRight(platform, "east")
        //printPlatform(platform)
        const platformkey = platform.map(r => r.join("")).join("-")
        const loopIndex = loop.indexOf(platformkey)
        if(loopIndex !== -1) {
            const loopLength = i - loopIndex + 1
            const resLoopIndex = (cycles - loopIndex) % loopLength
            const resultPlatform = loop[loopIndex + resLoopIndex]
            if(resultPlatform)
                result = calculateWeight(resultPlatform.split("-"))
            else
                throw new Error("Incorrect calculations")
            break;
        } else loop.push(platformkey)
    }

    return result
}


function calculateWeight(platform: string[][] | string[]): number {
    let score = 0
    for(let i = 0; i < platform.length; i++) {
        const multiplier = (platform.length - i)
        for(let char of platform[i] || []) {
            if(char === "O") score += multiplier
        }
    }
    return score
}


function rollRocksToUpDown(platform: string[][], direction: "north" | "south"): string[][] {
    let completed_rolling = false
    while(!completed_rolling) {
        completed_rolling = true
        for(let i = 0; i < platform.length; i++) {
            const process_row = platform[i]
            if(!process_row) throw new Error("Invalid i")
            let next_row: string[] | undefined = [];
            switch(direction) {
                case "north": next_row = platform[i - 1]; break;
                case "south": next_row = platform[i + 1]; break;
            }
            if(!next_row?.length) continue;
            for(let j = 0; j < (process_row.length ?? 0); j++) {
                if(process_row[j] === "O") {
                    if(next_row[j] === ".") {
                        completed_rolling = false
                        switch(direction) {
                            case "north": platform[i-1]![j] = "O"; break;
                            case "south": platform[i+1]![j] = "O"; break;
                        }
                        platform[i]![j] = "."
                    }
                }
            }

            //printPlatform(platform)
        }
    }

    return platform
}

function rollRocksToLeftRight(platform: string[][], direction: "east" | "west"): string[][] {
    let completed_rolling = false
    if(!platform[0]) return platform
    while(!completed_rolling) {
        completed_rolling = true
        for(let i = 0; i < platform[0].length; i++) {
            const process_column = platform.map(p => p[i]!)
            if(!process_column) throw new Error("Invalid i")
            let next_column: string[] | undefined = [];
            switch(direction) {
                case "west": next_column = platform.map(p => p[i - 1]!); break;
                case "east": next_column = platform.map(p => p[i + 1]!); break;
            }
            if(!next_column?.length) continue;
            for(let j = 0; j < (process_column.length ?? 0); j++) {
                if(process_column[j] === "O") {
                    if(next_column[j] === ".") {
                        completed_rolling = false
                        switch(direction) {
                            case "west": platform[j]![i-1]! = "O"; break;
                            case "east": platform[j]![i+1]! = "O"; break;
                        }
                        platform[j]![i]! = "."
                    }
                }
            }

            //printPlatform(platform)
        }
    }

    return platform
}

/*function printPlatform(platform: string[][]) {
    for(let row of platform) {
        console.log(row.join(""))
    }
    console.log("")
}*/