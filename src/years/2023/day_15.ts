export const INPUT_SPLIT = ",";
export function part_1(input: string[]): number {
    let sum = 0
    for(let code of input) {
        sum += hashAlgorithm(code)
    }
    return sum;
}


export function part_2(input: string[]): number {
    const boxes: {label: string, focal_length: number}[][] = Array.from({length: 256}, () => [])
    let sum = 0

    for(let code of input) {
        const [_, label, __,num] = /([a-z]+)(=(\d+))?/.exec(code) ?? []

        if(!label) continue;
        const box = hashAlgorithm(label)
        if(code.endsWith("-")) {
            boxes[box] = boxes[box]?.filter(l => l.label !== label) ?? []
        } else {
            const number = parseInt(num ?? "")
            if(!isNaN(number)) {
                const existsAt = boxes[box]?.findIndex(l => l.label === label) ?? -1
                if(existsAt === -1) {
                    boxes[box]?.push({focal_length: number, label})
                } else {
                    boxes[box]?.splice(existsAt, 1, {focal_length: number, label})
                }
            }
        }
    }

    for(let i = 0; i < 256; i++) {
        const lenses = boxes[i] ?? []
        for(let j = 0; j < lenses.length; j++) {
            sum += (i + 1) * (j + 1) * lenses[j]!.focal_length!
        }
    }

    return sum;
}

function hashAlgorithm(str: string) {
    let value = 0
    for(let char of str) {
        value += char.charCodeAt(0)
        value *= 17
        value %= 256
    }
    return value
}