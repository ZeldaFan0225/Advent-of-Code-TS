export const INPUT_SPLIT = "\n\n";
const TowelColors = {
    "w": 1,
    "u": 2,
    "b": 3,
    "r": 4,
    "g": 5,
} as const

function translateCombination(pattern: string) {
    const res: number[] = []
    for(const letter of pattern.split("")) {
        res.push(TowelColors[letter as "w" | "u" | "b" | "r" | "g"])
    }
    return res
}

export function part_1(input: string[]): number {
    const [rawTowels, rawCombinations] = input as [string, string]
    const towels: number[][] = []
    for(const t of rawTowels.split(", ")) {
        towels.push(translateCombination(t))
    }
    // long combinations first to get to the goal faster
    towels.sort((a, b) => b.length - a.length)
    
    let total = 0;
    const memo = new Map<string, boolean>();
    
    for(const comb of rawCombinations.split("\n")) {
        if (checkCombinationPossible(towels, translateCombination(comb), memo)) {
            total++;
        }
    }
    
    return total;
}

function checkCombinationPossible(towels: number[][], combination: number[], memo: Map<string, boolean>): boolean {
    const key = combination.join("");
    if (memo.has(key)) return memo.get(key)!;
    if (combination.length === 0) return true;
    
    for (const towel of towels) {
        if (towel.length > combination.length) continue;
        
        // Fast check for match using array comparison
        let matches = true;
        for (let i = 0; i < towel.length; i++) {
            if (towel[i] !== combination[i]) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            const remaining = combination.slice(towel.length);
            if (checkCombinationPossible(towels, remaining, memo)) {
                memo.set(key, true);
                return true;
            }
        }
    }
    
    memo.set(key, false);
    return false;
}

export function part_2(input: string[]): number {
    const [rawTowels, rawCombinations] = input as [string, string]
    const towels: number[][] = []
    for(const t of rawTowels.split(", ")) {
        towels.push(translateCombination(t))
    }
    // Sort towels by length for optimization
    towels.sort((a, b) => b.length - a.length)

    let total = 0;
    for(const comb of rawCombinations.split("\n")) {
        const combination = translateCombination(comb)
        const count = countCombinationWays(towels, combination, new Map())
        total += count
    }
    
    return total
}

function countCombinationWays(towels: number[][], combination: number[], memo: Map<string, number>): number {
    const key = combination.join("")
    if (memo.has(key)) return memo.get(key)!
    
    if(combination.length === 0) return 1
    
    let ways = 0
    for(const towel of towels) {
        if (towel.length > combination.length) continue
        // Fast check for match using array comparison
        let matches = true;
        for (let i = 0; i < towel.length; i++) {
            if (towel[i] !== combination[i]) {
                matches = false;
                break;
            }
        }
        if (matches) {
            ways += countCombinationWays(towels, combination.slice(towel.length), memo)
        }
    }
    
    memo.set(key, ways)
    return ways
}
