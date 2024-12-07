export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const numbers = input.map(r => {
        const [target, nums] = r.split(": ") as [string, string];
        return [parseInt(target), nums.split(" ").map(n => parseInt(n))] as [number, number[]];
    })

    let result = 0;

    for(const [target, nums] of numbers) {
        const [start, ...rest] = nums;
        if(
            canCalculate(rest, start!, target, "+", 1) ||
            canCalculate(rest, start!, target, "*", 1)
        ) {
            result += target
        }
    }

    return result;
}


export function part_2(input: string[]): number {
    const numbers = input.map(r => {
        const [target, nums] = r.split(": ") as [string, string];
        return [parseInt(target), nums.split(" ").map(n => parseInt(n))] as [number, number[]];
    })

    let result = 0;

    for(const [target, nums] of numbers) {
        const [start, ...rest] = nums;
        if(
            canCalculate(rest, start!, target, "+", 2) ||
            canCalculate(rest, start!, target, "*", 2) ||
            canCalculate(rest, start!, target, "||", 2)
        ) {
            result += target
        }
    }

    return result;
}

function canCalculate(numbers: number[], current: number, target: number, sign: "+" | "*" | "||", part: 1 | 2): boolean {
    if(current > target) {
        return false;
    }
    if(numbers.length === 0) {
        return current === target;
    }

    const [next, ...rest] = numbers;

    switch (sign) {
        case "+": current += next!; break;
        case "*": current *= next!; break;
        case "||": current = parseInt(current.toString() + next!.toString()); break;
    }

    return (
        canCalculate(rest, current, target, "+", part) ||
        canCalculate(rest, current, target, "*", part) ||
        (part === 2 && canCalculate(rest, current, target, "||", part))
    )
}