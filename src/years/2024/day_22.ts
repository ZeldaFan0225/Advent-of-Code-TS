export const INPUT_SPLIT = "\n";
// 32 = 2**5
// 64 = 2**6
// 2048 = 2**11
// 16777216 = 2**24

export function part_1(input: string[]): number {
    let total = 0;
    for(let num of input) {
        const number = BigInt(num)
        const generator = generateSecretNumbers(number)
        let current = number
        for(let i = 0; i < 2000; i++) {
            current = generator.next().value
        }
        total += Number(current)
    }

    return total
}


function* generateSecretNumbers(seed: bigint): Generator<bigint> {
    while (true) {
        seed = (((seed << 6n) ^ seed) & 0xFFFFFFn); // Modulo 2^24 using bitwise AND
        seed = (((seed >> 5n) ^ seed) & 0xFFFFFFn);
        seed = (((seed << 11n) ^ seed) & 0xFFFFFFn);

        yield seed;
    }
}

export function part_2(input: string[]): number {
    let monkeys: {prices: number[], deltas: number[]}[] = []
    for(let num of input) {
        const number = BigInt(num)
        const liteGen = getLastDigitOfSecretNumbers(number)
        const currPrices = [parseInt(num)%10]
        const currDeltas = []
        for(let i = 0; i < 2000; i++) {
            const lite = liteGen.next().value
            currPrices.push(lite)
            currDeltas.push(lite - currPrices[i]!)
        }
        monkeys.push({prices: currPrices, deltas: currDeltas})
    }

    // check all combinations of deltas
    // i love them brute forces
    let max = 0;
    for(let digit1 = -9; digit1 <= 9; digit1++) {
        for(let digit2 = -9; digit2 <= 9; digit2++) {
            for(let digit3 = -9; digit3 <= 9; digit3++) {
                for(let digit4 = -9; digit4 <= 9; digit4++) {
                    let total = 0;
                    for(const {prices, deltas} of monkeys) {
                        for(let i = 4; i < 2000; i++) {
                            if(
                                deltas[i-1] === digit4 &&
                                deltas[i-2] === digit3 &&
                                deltas[i-3] === digit2 &&
                                deltas[i-4] === digit1
                            ) {
                                total += prices[i]!
                                break
                            }
                        }
                    }
                    if(total > max) {
                        max = total
                    }
                }
            }
        }
        console.log(digit1)
    }

    return max
}

function* getLastDigitOfSecretNumbers(seed: bigint): Generator<number> {
    while (true) {
        seed = (((seed << 6n) ^ seed) & 0xFFFFFFn); // Modulo 2^24 using bitwise AND
        seed = (((seed >> 5n) ^ seed) & 0xFFFFFFn);
        seed = (((seed << 11n) ^ seed) & 0xFFFFFFn);

        yield Number(seed % 10n); // Extract last digit directly
    }
}