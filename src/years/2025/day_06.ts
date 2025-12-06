export const INPUT_SPLIT = "\n";

function processNumbers(numbers: number[], operation: number): number {
    if(operation === 0) {
        return numbers.reduce((a, b) => a * b, 1)
    } else {
        return numbers.reduce((a, b) => a + b, 0)
    }
}

export function part_1(input: string[]): number {
    const nums = input;
    const o = nums.splice(-1, 1)[0]!
    const rows = nums.map(l => l.split(" ").filter(Boolean).map(Number)) as number[][]
    const operations = o.split(" ").filter(Boolean).map(c => c.charCodeAt(0) - 42) // 0 = *, 1 = +
    let sum = 0
    for(let i = 0; i < operations.length; i++) {
        sum += processNumbers(rows.map(r => r[i]!), operations[i]!)
    }
    return sum
}

export function part_2(input: string[]): number {
    const nums = input;
    const o = nums.splice(-1, 1)[0]!
    const operations = o.split(" ").filter(Boolean).map(c => c.charCodeAt(0) - 42) // 0 = *, 1 = +

    let numbers: number[] = []
    let j = 0
    let sum = 0
    for(let i = 0; i < nums[0]!.length; i++) {
        if(nums.every(l => l[i] === " ")) {
            // Block has ended, process numbers
            sum +=processNumbers(numbers, operations[j++]!)
            numbers = []
        } else {
            let number = nums
                .map((l, j) => Math.max(0, l.charCodeAt(i) - 48))
                .filter(Boolean)
                .reverse()
                .map((n, j) => n * 10 ** (j))
                .reduce((a, b) => a + b, 0)
            numbers.push(number)
        }
    }
    sum += processNumbers(numbers, operations[j]!)

    return sum
}