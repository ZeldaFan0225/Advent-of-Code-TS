export const INPUT_SPLIT = "\n\n";
interface Machine {
    a: [number, number],
    b: [number, number],
    prize: [number, number]
}

export function part_1(input: string[]): number {
    let tokens = 0;
    for(const machine of input) {
        tokens += minTokensForMachine(parseMachine(machine))
    }
    return tokens
}

export function part_2(input: string): number {
    let tokens = 0;
    for(const machine of input) {
        tokens += minTokensForMachine(parseMachine(machine, 10000000000000))
    }
    return tokens
}

function parseMachine(input: string, offset?: number): Machine {
    const [raw_a, raw_b, raw_prize] = input.split("\n") as [string, string, string]
    const [xa, ya] = raw_a.slice(12).split(", Y+").map(Number) as [number, number]
    const [xb, yb] = raw_b.slice(12).split(", Y+").map(Number) as [number, number]
    const [xp, yp] = raw_prize.slice(9).split(", Y=").map(Number) as [number, number]

    return {
        a: [xa, ya],
        b: [xb, yb],
        prize: [xp + (offset || 0), yp + (offset || 0)]
    }
}

/**
 * Calculate the tokens needed to win the machine
 * @param machine The machine to calculate tokens for 
 * @returns 0 if not possible, else the amount of tokens needed
 */
function minTokensForMachine(machine: Machine) {
    // Use BigInts to avoid overflow
    const prize0 = BigInt(machine.prize[0]);
    const prize1 = BigInt(machine.prize[1]);
    const a0 = BigInt(machine.a[0]);
    const a1 = BigInt(machine.a[1]);
    const b0 = BigInt(machine.b[0]);
    const b1 = BigInt(machine.b[1]);

    // How it works:
    // Get the intersection of the two lines
    // f(x) = m1 * x
    // g(x) = m2 * (x - xp) + yp
    // Where
    //      m1 = prize1 / prize0,
    //      m2 = b1 / b0,
    //      xp = x of the prize,
    //      yp = y of the prize
    //
    // m1 can be replaced with y1 / x2 (same for m2)
    //
    // To get the intersection we solve the equation for x:
    // m1 * x = m2 * (x - xp) + yp
    // x = (prize1 * a0 * b0 - prize0 * a0 * b1) / (a1 * b0 - a0 * b1)
    const top = (prize1 * a0 * b0) - (prize0 * a0 * b1);
    const bottom = (a1 * b0) - (a0 * b1);
    const x = top / bottom;

    if (x % BigInt(1) !== BigInt(0)) return 0;
    if (
        (x % a0) === BigInt(0) &&
        ((prize0 - x) % b0) === BigInt(0)
    ) {
        const a_count = x / a0;
        const b_count = (prize0 - x) / b0;

        return Number(a_count * BigInt(3) + b_count);
    }
    return 0;
}
