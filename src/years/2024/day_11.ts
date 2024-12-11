export const INPUT_SPLIT = " ";

export function part_1(input: string[]): number {
    const stones = input.map(Number);
    let counts = new Map<number, number>();

    for(const stone of stones) {
        counts.set(stone, (counts.get(stone) || 0) + 1)
    }

    for(let i = 0; i < 25; i++) {
        counts = blinkOnce(counts)
    }

    return countStones(counts);
}

export function part_2(input: string[]): number {
    const stones = input.map(Number);
    let counts = new Map<number, number>();

    for(const stone of stones) {
        counts.set(stone, (counts.get(stone) || 0) + 1)
    }

    for(let i = 0; i < 75; i++) {
        counts = blinkOnce(counts)
    }

    return countStones(counts);
}

function blinkOnce(stones: Map<number, number>) {
    const newStones = new Map<number, number>();
    for(const [stone, count] of stones.entries()) {
        const digits = Math.floor(Math.log10(stone)) + 1;
        if(stone === 0) {
            newStones.set(1, (newStones.get(1) || 0) + count)
        } else if(digits % 2 === 0 && digits > 1) {
            const num1: number = Math.floor(stone / Math.pow(10, digits / 2));
            const num2: number = stone % Math.pow(10, digits / 2);
            newStones.set(num1, (newStones.get(num1) || 0) + count)
            newStones.set(num2, (newStones.get(num2) || 0) + count)
        } else {
            newStones.set(stone * 2024, (newStones.get(stone * 2024) || 0) + count)
        }
    }
    return newStones
}

function countStones(stones: Map<number, number>) {
    let sum = 0;
    for(const count of stones.values()) {
        sum += count
    }
    return sum
}
