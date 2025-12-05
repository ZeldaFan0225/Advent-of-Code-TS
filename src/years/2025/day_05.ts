export const INPUT_SPLIT = "\n\n";

function combineRanges(ranges: { start: number; end: number }[]): { start: number; end: number }[] {
    if (ranges.length === 0) return [];
    ranges.sort((a, b) => a.start - b.start);
    let removeRanges = new Set<number>();
    for(let i = 0; i < ranges.length; i++) {
        if(removeRanges.has(i)) {
            continue;
        }
        const range = ranges[i]!;
        for(let j = i+1; j < ranges.length; j++) {
            if(removeRanges.has(j)) {
                continue;
            }
            const procRange = ranges[j]!;
            if(procRange.start <= range.end) {
                if(procRange.end <= range.end) {
                    removeRanges.add(j);
                } else {
                    removeRanges.add(j);
                    range.end = procRange.end;
                }
            }
        }
    }
    return ranges.filter((_, index) => !removeRanges.has(index));
}

export function part_1(input: [string, string]): number {
    const [rangesRaw, ingredientsRaw] = input;

    let ranges = rangesRaw.split("\n").map(line => {
        const [start, end] = line.split("-").map(Number);
        return { start, end };
    }) as { start: number; end: number }[];
    
    ranges = combineRanges(ranges);

    const ingredients = new Set(ingredientsRaw.split("\n").map(Number));

    let count = 0;
    outer:
    for(const ingredient of ingredients) {
        for(const range of ranges) {
            if(ingredient >= range.start && ingredient <= range.end) {
                count++;
                continue outer;
            }
        }
    }

    return count;
}


export function part_2(input: [string, string]): number {
    const [rangesRaw, _] = input;

    let ranges = rangesRaw.split("\n").map(line => {
        const [start, end] = line.split("-").map(Number);
        return { start, end };
    }) as { start: number; end: number }[];
    
    ranges = combineRanges(ranges);

    const totalFreshItems = ranges.reduce((sum, range) => sum + (range.end - range.start + 1), 0);

    return totalFreshItems;
}