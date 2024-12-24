export const INPUT_SPLIT = "\n\n";
interface Gate {
    lhs: string;
    op: string;
    rhs: string;
    res: string;
}
export function part_1(input: string[]): bigint {
    const [rawWireStates, rawGates] = input as [string, string];
    const resultGatesStates = new Map<string, boolean>();
    const wireStates = new Map<string, boolean>(rawWireStates.split("\n").map(l => [l.split(": ")[0]!, l.split(": ")[1] === "1"]));
    let resultGatesCount = 0;
    const gates = rawGates.split("\n").map(l => {
        const gate = parseGate(l);
        if(gate.res.startsWith("z")) {
            resultGatesCount++;
        }
        return gate;
    });

    while(resultGatesStates.size < resultGatesCount && gates.length) {
        const next = gates.shift()!;
        if(!wireStates.has(next.lhs) || !wireStates.has(next.rhs)) {
            gates.push(next);
            continue;
        }
        if(wireStates.has(next.res)) continue;
        let result = false;
        switch(next.op) {
            case "AND":
                result = wireStates.get(next.lhs)! && wireStates.get(next.rhs)!;
                break;
            case "OR":
                result = wireStates.get(next.lhs)! || wireStates.get(next.rhs)!;
                break;
            case "XOR":
                result = wireStates.get(next.lhs)! !== wireStates.get(next.rhs)!;
                break;
        }

        wireStates.set(next.res, result);
        if(next.res.startsWith("z")) {
            resultGatesStates.set(next.res, result);
        }
    }

    let result = 0n;
    let bits = ""
    for(const [key, value] of resultGatesStates) {
        const i = BigInt(key.slice(1));
        result += (value ? 1n : 0n) << i;
    }
    
    return result
}

function parseGate(gate: string): Gate {
    const [operation, res] = gate.split(" -> ") as [string, string];
    const [lhs, op, rhs] = operation.split(" ") as [string, string, string];
    return {lhs, op, rhs, res};
}

export function part_2(input: string): number {
    return input.length
}