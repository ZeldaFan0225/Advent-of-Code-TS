export const INPUT_SPLIT = undefined;
export function part_1(input: string): number {
    let instructions = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)
    let result = 0
    for(let instr of instructions) {
        const first = parseInt(instr[1]!);
        const second = parseInt(instr[2]!);
        result += first * second
    }
    return result
}


export function part_2(input: string): number {
    return input.length
}