export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const groups = input.map(l => {
        const [springs, keys] = l.split(" ")
        return {
            springs: springs!.split(""),
            keys: keys!.split(",").map(k => parseInt(k))
        }
    })

    for(let {springs, keys} of groups) {
        console.log(getBrokenCount(springs, keys))
    }

    return 0;
}


export function part_2(input: string[]): number {
    return input.length
}

function getBrokenCount(springs: string[], keys: number[], matched = 0): number {
    if(springs[0] === ".") {
        return isWorking(springs, keys, matched)
    } else if(springs[0] === "#") {
        return isBroken(springs, keys, matched)
    } else {
        return isWorking(springs, keys, matched) + isBroken(springs, keys, matched)
    }
}

function isBroken(springs: string[], keys: number[], matched = 0): number {
    if(!springs.length) return 0;
    let key_finished = false;
    if(matched === keys[0]) {
        keys = keys.slice(1)
        key_finished = true
    } else if((keys[0] || 0) < matched) {
        matched++
    }

    if(key_finished) return getBrokenCount(springs.slice(1), keys, 0)
    else return getBrokenCount(springs.slice(1), keys, matched)
}

function isWorking(springs: string[], keys: number[], matched = 0): number {
    if(!springs.length) return 0;
    //was enough to satisfy key
    if(matched === keys[0]) {
        keys = keys.slice(1)
    } else if((keys[0] || 0) > matched) {
        return 0
    }
    return getBrokenCount(springs.slice(1), keys, 0)
}