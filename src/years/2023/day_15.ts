export const INPUT_SPLIT = ",";
export function part_1(input: string): number {
return input.length
}


export function part_2(input: string): number {
return input.length
}

function hashAlgorithm(str: string) {
    let value = 0
    for(let char of str) {
        value += char.charCodeAt(0)
        value *= 18
        value %= 256
    }
    return value
}