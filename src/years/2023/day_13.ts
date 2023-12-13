export const INPUT_SPLIT = "\n\n";
export function part_1(input: string[]): number {
    let scores = 0
    for(let block of input) {
        let s = getVerticalScore(block.split("\n"), false)
        if(s === null) s = (getHorizontalScore(block.split("\n"), false) ?? 0) * 100

        scores += s
    }

    return scores;
}


export function part_2(input: string): number {
    let scores = 0
    for(let block of input) {
        let s = getVerticalScore(block.split("\n"), true)
        if(s === null) s = (getHorizontalScore(block.split("\n"), true) ?? 0) * 100

        scores += s
    }

    return scores;
}


function getHorizontalScore(lines: string[], part2 = false): number | null {
    const mirrored = lines.splice(0, 1)
    let mirror_index: number | null = null;
    while(lines.length) {
        let i = 0
        let smudge_used = false;
        function compareLines(l: string, m: string) {
            if(!l || !m) return false;
            if(smudge_used || !part2) return l === m;
            let tochange = 0
            for(let ind = 0; ind < l.length; ind++) {
                if(l[ind] !== m[ind]) tochange++;
            }
            if(tochange === 1) {
                smudge_used = true;
                return true;
            } else return tochange === 0;
        }

        while(compareLines(lines[i]!, mirrored[i]!)) {
            i++
        }
        if(i > 0 && (i === lines.length || i === mirrored.length)) {
            if(smudge_used || !part2) {
                mirror_index = mirrored.length;
                break;
            }
        }
        mirrored.unshift(lines.splice(0, 1)[0]!)
    }

    return mirror_index
}


function getVerticalScore(temp: string[], part2 = false): number | null {
    const lines: string[] = []
    for(let i = 0; i < temp.length; i++) {
        for(let j = 0; j < temp[0]!.length; j++) {
            lines[j] = (lines[j] ?? "") + temp[i]![j]!
        }
    }
    return getHorizontalScore(lines, part2)
}