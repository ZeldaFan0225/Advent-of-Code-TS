export const INPUT_SPLIT = "\n\n";
export function part_1(input: string[]): number {
    let scores = 0
    for(let block of input) {
        let s = getVerticalScore(block.split("\n"))
        if(s === null) s = (getHorizontalScore(block.split("\n")) ?? 0) * 100

        scores += s
    }

    return scores;
}


export function part_2(input: string): number {
    return input.length
}



function getHorizontalScore(lines: string[]): number | null {
    const mirrored = lines.splice(0, 1)
    let mirror_index: number | null = null;
    while(lines.length) {
        let i = 0
        while(lines[i] === mirrored[i]) {
            i++
        }
        if(i > 0 && (i === lines.length || i === mirrored.length)) {
            mirror_index = mirrored.length;
            break;
        }
        mirrored.unshift(lines.splice(0, 1)[0]!)
    }

    return mirror_index
}


function getVerticalScore(temp: string[]): number | null {
    const lines: string[] = []
    for(let i = 0; i < temp.length; i++) {
        for(let j = 0; j < temp[0]!.length; j++) {
            lines[j] = (lines[j] ?? "") + temp[i]![j]!
        }
    }
    return getHorizontalScore(lines)
}