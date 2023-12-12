export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    let sum = 0;
    for(let line of input) {
        const [springs, keys] = line.split(" ")
        sum += getPossibleCombinations(springs!.split(""), keys!.split(",").map(k => parseInt(k)), 0)
    }

    return sum;
}


export function part_2(input: string[]): number {
    const groups = input.map(l => {
        const [springs, keys] = l.split(" ")
        const s = springs!.split("")
        const k = keys!.split(",").map(k => parseInt(k))
        return {
            springs: [...s, "?", ...s, "?", ...s, "?", ...s, "?", ...s],
            keys: [...k, ...k, ...k, ...k, ...k]
        }
    })

    let sum = 0;
    for(let { springs, keys} of groups) {
        sum += getPossibleCombinations(springs, keys, 0)
    }

    return sum;
}

function getPossibleCombinations(springs: string[], keys: number[], matched = 0): number {
    //console.log(" ")
    //console.log(springs.join(""))
    //console.log(keys, matched)
    // if no springs or keys left, return 1
    if(!springs.length) return keys.length ? 0 : 1

    if(springs[0] === ".") {
        return isWorking(springs, keys, matched)
    } else if(springs[0] === "#") {
        return isBroken(springs, keys, matched)
    } else if(springs[0] === "?") {
        // now we don't know what should go here; so simply try both
        return isBroken(springs, keys, matched) + isWorking(springs, keys, matched)
    } else {
        return 0;
    }
}

function isWorking(springs: string[], keys: number[], matched = 0): number {
    //if there are any previous matches that haven't been completed the combination is not possible
    if(matched) return 0;
    return getPossibleCombinations(springs.slice(1), keys, 0)
}

function isBroken(springs: string[], keys: number[], matched = 0): number {
    // if there are no keys, a broken spring is invalid
    if(!keys[0]) return 0;
    // if block ends at current position
    if(matched + 1 == keys[0]) {
        if(springs[1] && (springs[1] === "#")) return 0;
        return getPossibleCombinations(springs.slice(2), keys.slice(1), 0)
    }
    return getPossibleCombinations(springs.slice(1), keys, matched + 1)
}