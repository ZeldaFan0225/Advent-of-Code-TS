export const INPUT_SPLIT = "\n\n";
export function part_1(input: string[]): number {
    const {rules, updates} = parseInput(input as [string, string]);
    let total = 0;

    for(let update of updates) {
        const valid = getIsUpdateValid(update, rules);
        if(valid) total += update[Math.floor(update.length / 2)]!;
    }

    return total;
}

function includesNumbers(update: number[], end: number, numbers: Set<number>) {
    for(let i = 0; i <= end; i++) {
        if(numbers.has(update[i]!)) return true;
    }
    return false;
}

function getIsUpdateValid(update: number[], rules: Map<number, Set<number>>) {
    return update.every((num, i) => {
        const rule = rules.get(num);
        return !rule || !includesNumbers(update, i - 1, rule)
    })
}

function parseInput(input: [string, string]) {
    const [rulesRaw, updatesRaw] = input;
    const rules = new Map<number, Set<number>>();
    const updates: number[][] = []

    for(let rule of rulesRaw.split("\n")) {
        const [key, value] = rule.split("|").map(Number) as [number, number];
        if(!rules.has(key)) rules.set(key, new Set<number>());
        rules.get(key)!.add(value);
    }

    for(let update of updatesRaw.split("\n")) {
        updates.push(update.split(",").map(Number));
    }

    return {rules, updates}
}

export function part_2(input: string[]): number {
    const {rules, updates} = parseInput(input as [string, string]);
    let total = 0;

    for(let update of updates) {
        const valid = getIsUpdateValid(update, rules);
        if(!valid) {
            // fix odering and return middle number as result

        }
    }

    return total
}