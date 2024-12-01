export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const left: number[] = []
    const right: number[] = []

    for(const line of input) {
        const [l, r] = line.split("   ").map(n => parseInt(n))
        
        //binaryInsert(left, l!, 0, left.length-1)
        //binaryInsert(right, r!, 0, right.length-1)
        left.push(l!)
        right.push(r!)
    }

    // this is faster than binaryInsert D:
    left.sort((a, b) => a - b)
    right.sort((a, b) => a - b)

    let result = 0;
    for(let i = 0; i < left.length; i++) {
        result += Math.abs(left[i]! - right[i]!);
    }

    return result;
}

// I tried, but built in sort is faster
/*function binaryInsert(input: number[], value: number, start: number, end: number) {
    if(start >= end) {
        const max = Math.max(start, end)
        // Ensure that the value is inserted after the max value
        input.splice(input[max]! < value ? max + 1 : max, 0, value)
        return;
    }

    const mid = Math.floor((start + end) / 2);

    if(input[mid] === value) {
        // if the number already exists, just insert it before the existing number
        input.splice(mid, 0, value)
        return;
    }
    if(input[mid]! > value) {
        binaryInsert(input, value, start, mid-1)
    } else {
        binaryInsert(input, value, mid+1, end)
    }
}*/

export function part_2(input: string): number {
    const left: number[] = []
    const rightCount = new Map<number, number>()

    for(const line of input) {
        const [l, r] = line.split("   ").map(n => parseInt(n))
        
        left.push(l!)
        rightCount.set(r!, (rightCount.get(r!) || 0) + 1)
    }

    let result = 0;
    for(let i = 0; i < left.length; i++) {
        const r = left[i]!
        result += r * (rightCount.get(r) || 0)
    }

    return result;
}