export const INPUT_SPLIT = "\n\n";
export function part_1(input: string[]): number {
    let scores = 0
    for(let block of input) {
        let s = getVerticalScore(block)
        if(s === null) s = (getHorizontalScore(block) ?? 0) * 100

        scores += s
    }

    return scores;
}


export function part_2(input: string): number {
    return input.length
}

function getVerticalScore(input: string): number | null {
    const lines = input.split("\n")
    const stacks: string[][] = Array.from({length: lines.length}).map(() => []) as string[][]
    lines.forEach((l, i) => stacks[i]?.push(l[0]!))
    // will never be 0 as then there would not be any mirrored pattern
    let mirror_index = null;
    for(let i = 1; i < lines[0]!.length; i++) {
        if(
            // if last in stack matches with current
            stacks.every((s, j) => s.at(-1) === lines[j]![i])
        ) {
            if(mirror_index === null) mirror_index = i;
            stacks.forEach(s => s.pop())
        } else {
            mirror_index = null;
            stacks.forEach((s, j) => s.push(lines[j]![i]!))
        }

        // if stacks are emty i.e. mirror pattern was at start
        //console.log(stacks.every(s => s.length === 0))
        if(stacks.every(s => s.length === 0)) break;
    }

    return stacks.every(s => s.length !== lines[0]!.length) && mirror_index ? mirror_index : null;
}

function getHorizontalScore(input: string): number | null {
    const lines = input.split("\n")
    const stacks: string[][] = Array.from({length: lines[0]!.length}).map(() => []) as string[][]
    lines[0]!.split("").forEach((l, i) => stacks[i]?.push(l!))
    // will never be 0 as then there would not be any mirrored pattern
    let mirror_index = null;
    for(let i = 1; i < lines.length; i++) {
        if(
            // if last in stack matches with current
            stacks.every((s, j) => s.at(-1) === lines[i]![j])
        ) {
            if(mirror_index === null) mirror_index = i;
            stacks.forEach(s => s.pop())
        } else {
            mirror_index = null;
            stacks.forEach((s, j) => s.push(lines[i]![j]!))
        }

        // if stacks are emty i.e. mirror pattern was at start
        //console.log(stacks.every(s => s.length === 0))
        if(stacks.every(s => s.length === 0)) break;
    }

    return stacks.every(s => s.length !== lines.length) && mirror_index ? mirror_index : null;
}