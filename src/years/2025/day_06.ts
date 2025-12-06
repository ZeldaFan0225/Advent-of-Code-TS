export const INPUT_SPLIT = "\n";
export function part_1(input: [string, string, string, string]): string {
    const nums = input;
    const o = nums.splice(-1, 1)[0]!
    const rows = nums.map(l => l.split(" ").filter(Boolean).map(Number)) as number[][]
    const operations = o.split(" ").filter(Boolean).map(c => c.charCodeAt(0) - 42) // 0 = *, 1 = +
    let sum = 0
    for(let i = 0; i < operations.length; i++) {
        if(operations[i] === 0) {
            sum += rows.map(r => r[i]!).reduce((a, b) => a * b, 1)
        } else {
            sum += rows.map(r => r[i]!).reduce((a, b) => a + b, 0)
        }
    }
    return `${sum}`
}


export function part_2(input: string): number {
    return input.length
}