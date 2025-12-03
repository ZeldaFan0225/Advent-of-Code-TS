export const INPUT_SPLIT = "\n";
function findHighestScorePart1(input: string) {
    const vals = input.split("").map(Number);
    let firstIndex = null;
    let secondIndex = null;
    let first = null;
    let second = null;
    for(let i = 0; i < input.length-1; i++) {
        if(firstIndex === null) {
            firstIndex = i;
            first = vals[i];
            continue;
        }
        if(vals[i]! > first!) {
            firstIndex = i;
            first = vals[i];
        }
    }
    for(let j = firstIndex! + 1; j < input.length; j++) {
        if(secondIndex === null) {
            secondIndex = j;
            second = vals[j];
            continue;
        }
        if(vals[j]! > second!) {
            secondIndex = j;
            second = vals[j];
        }
    }
    return first! * 10 + second!;
}

function findHighestScorePart2(input: string) {
    const vals = input.split("").map(Number);
    const indexes = Array.from({length: vals.length}, (_, i) => vals.length-12+i);
    for(let i = 0; i < indexes.length; i++) {
        // optimize every digit
        const minIndex = i === 0 ? 0 : indexes[i-1]!+1;
        let bestVal = vals[indexes[i]!]!;
        let bestIndex = indexes[i]!;
        for(let k = bestIndex - 1; k >= minIndex; k--) {
            if(vals[k]! >= bestVal) {
                bestVal = vals[k]!;
                bestIndex = k;
            }
        }
        indexes[i] = bestIndex;
    }
    const numbers = indexes.map(i => vals[i]!).join("");
    return Number(numbers);
}

export function part_1(input: string[]): number {
    const sum = input.map(bank => findHighestScorePart1(bank)).reduce((a,b) => a + b, 0);
    return sum
}

export function part_2(input: string[]): number {
    const sum = input.map(bank => findHighestScorePart2(bank)).reduce((a,b) => a + b, 0);
    return sum
}