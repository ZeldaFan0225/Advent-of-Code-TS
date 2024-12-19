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
    for(const comb of rawCombinations.split("\n")) {
        const possibleCount = isCombinationPossible(towels, translateCombination(comb))
        if(possibleCount) {
            total++
        }
    }
    
    return total
}

function isCombinationPossible(towels: number[][], combination: number[], alreadyExplored: Set<string> = new Set()): boolean {
    if(alreadyExplored.has(combination.join(""))) return false;
    alreadyExplored.add(combination.join(""))
    if(combination.length === 0) return true;
    for(const towel of towels) {
        if (towel.every((c, i) => c === combination[i])) {
            const isPossible = isCombinationPossible(towels, combination.slice(towel.length), alreadyExplored)
            if(isPossible) return true
        }
    }

    return false;
}

export function part_2(input: string[]): number {
    const [rawTowels, rawCombinations] = input as [string, string]
    const towels: number[][] = []
    for(const t of rawTowels.split(", ")) {
        towels.push(translateCombination(t))
    }
    // group together all lowels which in sum produce another towel
    const towelGroups: Map<string, string[][]> = new Map()
    for(const towel of towels) {
        towelGroups.set(
            towel.join(""),
            towelCanBeConstructedFrom(towels, towel)
        )
    }

    const groupedTowels = Array.from(towelGroups.keys()).map(towel => towel.split("").map(Number))
    groupedTowels.sort((a, b) => b.length - a.length)
    console.log(towelGroups)

    let total = 0;
    for(const comb of rawCombinations.split("\n")) {
        const combinations = towelCanBeConstructedFrom(groupedTowels, translateCombination(comb))//, new Set())
        console.log(combinations)
        /*if(combinations.length) {
            for(const combination of combinations) {
                let count = 1;
                for(const towel of combination) {
                    count *= towelGroups.get(towel)!.length
                }
                console.log(combination, count)
                total += count
            }
        }*/
       total += combinations.length
    }

    return total
}

function towelCanBeConstructedFrom(towels: number[][], compareTowel: number[], alreadyExplored?: Set<string>): string[][] {
    if(alreadyExplored && alreadyExplored.has(compareTowel.join(""))) return []
    if(alreadyExplored) alreadyExplored.add(compareTowel.join(""))
    if(compareTowel.length === 0) return [[]]
    let combinations = []
    for(const towel of towels) {
        if (towel.length > compareTowel.length) continue;
        if (towel.every((c, i) => c === compareTowel[i])) {
            const combs = towelCanBeConstructedFrom(towels, compareTowel.slice(towel.length), alreadyExplored)
            if(combs.length) {
                combs.forEach(c => c.unshift(towel.join("")))
                combinations.push(...combs)
            }
        }
    }

    return combinations;
}