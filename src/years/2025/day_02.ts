export const INPUT_SPLIT = ",";

function bruteForce1(rangeStart: number, rangeEnd: number): number {
    const diff = rangeEnd - rangeStart;
    let count = 0;
    for(let i = 0; i <= diff; i++) {
        const current = rangeStart + i + "";
        if(current.length % 2 === 1) {
            continue;
        }
        if(current.slice(0, current.length/2) === current.slice(current.length/2)) {
            count+=rangeStart + i;
        }
    }
    return count;
}

export function part_1(input: string[]): number {
    const ranges = input.map(l => l.split("-").map(Number)) as [number, number][];
    let count = 0
    for(const [start, end] of ranges) {
        count += bruteForce1(start, end)
    }
    return count
}

function bruteForce2(rangeStart: number, rangeEnd: number): number {
    const diff = rangeEnd - rangeStart;
    let count = 0;
    for(let i = 0; i <= diff; i++) {
        const current = rangeStart + i + "";
        const recurring = /^(\d+)(\1){1,}$/.test(current);
        
        if(recurring) {
            count+=rangeStart + i;
            console.log(current)
        }
    }
    return count;
}

export function part_2(input: string[]): number {
    const ranges = input.map(l => l.split("-").map(Number)) as [number, number][];
    let count = 0
    for(const [start, end] of ranges) {
        count += bruteForce2(start, end)
    }
    return count
}