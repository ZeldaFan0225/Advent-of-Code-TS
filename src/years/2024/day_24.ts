export const INPUT_SPLIT = "\n\n";

// Types for logic gates and circuit state
interface LogicGate {
    lhs: string;
    op: string;
    rhs: string;
    res: string;
}

type WireStates = Map<string, boolean>;
type ResultGates = Map<string, boolean>;

// Parse input functions
function parseWireStates(rawWireStates: string): WireStates {
    return new Map(
        rawWireStates.split("\n").map(line => {
            const [wire, state] = line.split(": ");
            return [wire!, state === "1"];
        })
    );
}

function parseGate(gate: string): LogicGate {
    const [operation, res] = gate.split(" -> ") as [string, string];
    const [lhs, op, rhs] = operation.split(" ") as [string, string, string];
    return { lhs, op, rhs, res };
}

// Gate evaluation functions
function evaluateGate(gate: LogicGate, wireStates: WireStates): boolean {
    const lhsValue = wireStates.get(gate.lhs)!;
    const rhsValue = wireStates.get(gate.rhs)!;
    
    switch (gate.op) {
        case "AND":
            return lhsValue && rhsValue;
        case "OR":
            return lhsValue || rhsValue;
        case "XOR":
            return lhsValue !== rhsValue;
        default:
            throw new Error(`Unknown operation: ${gate.op}`);
    }
}

function canEvaluateGate(gate: LogicGate, wireStates: WireStates): boolean {
    return wireStates.has(gate.lhs) && 
           wireStates.has(gate.rhs) && 
           !wireStates.has(gate.res);
}

export function part_1(input: string[]): bigint {
    const [rawWireStates, rawGates] = input as [string, string];
    const wireStates = parseWireStates(rawWireStates);
    const resultGates: ResultGates = new Map();
    
    // Parse gates and count result gates (those starting with 'z')
    const gates = rawGates.split("\n").map(parseGate);
    const resultGatesCount = gates.filter(g => g.res.startsWith("z")).length;

    // Process gates until all result gates are evaluated
    while (resultGates.size < resultGatesCount && gates.length) {
        const currentGate = gates.shift()!;
        
        if (!canEvaluateGate(currentGate, wireStates)) {
            gates.push(currentGate);
            continue;
        }

        const gateResult = evaluateGate(currentGate, wireStates);
        wireStates.set(currentGate.res, gateResult);
        
        if (currentGate.res.startsWith("z")) {
            resultGates.set(currentGate.res, gateResult);
        }
    }

    // Convert result gates to final number
    let result = 0n;
    for (const [key, value] of resultGates) {
        const bitPosition = BigInt(key.slice(1));
        result += (value ? 1n : 0n) << bitPosition;
    }

    return result;
}

/**
 * Part 2 logic taken from https://github.com/Marcosld/aoc2024/blob/main/24.mjs
 */

type LogicGate2 = [string, string, string, string];

function padNumber(n: number): string {
    return n.toString().padStart(2, "0");
}

function parseGates(gatesStr: string): LogicGate2[] {
    return gatesStr.split("\n").map(gateStr => {
        const [operation, result] = gateStr.split(" -> ") as [string, string];
        const [op1, op, op2] = operation.split(" ") as [string, string, string];
        return [op1, op, op2, result];
    });
}

function findConnectedGate(gates: LogicGate2[], op1: string, op: string, op2: string): [string, string?] {
    const foundGate = gates.find(
        ([gop1, gop, gop2]) =>
            gop === op &&
            (gop1 === op1 || gop1 === op2 || gop2 === op1 || gop2 === op2),
    );
    if (!foundGate) {
        throw new Error(`No gate found for ${op1} ${op} ${op2}`);
    }

    const [gop1, , gop2, result] = foundGate;
    if (gop1 !== op1 && gop1 !== op2) {
        return [result, gop1];
    }
    if (gop2 !== op1 && gop2 !== op2) {
        return [result, gop2];
    }
    return [result];
}

export function part_2(input: string[]): string {
    const [, gatesStr] = input as [string, string];
    const gates = parseGates(gatesStr);
    const wrongGates = new Set<string>();
    
    let [carry] = findConnectedGate(gates, "x00", "AND", "y00");
    
    for (let i = 2; i < 45; i++) {
        const currIndex = padNumber(i);
        const prevIndex = padNumber(i - 1);

        const [currXor] = findConnectedGate(gates, `x${currIndex}`, "XOR", `y${currIndex}`);
        const [lastAnd] = findConnectedGate(gates, `x${prevIndex}`, "AND", `y${prevIndex}`);
        const [lastXor] = findConnectedGate(gates, `x${prevIndex}`, "XOR", `y${prevIndex}`);
        
        const [intermediateAnd, wrong1] = findConnectedGate(gates, carry, "AND", lastXor);
        const [intermediateOr, wrong2] = findConnectedGate(gates, lastAnd, "OR", intermediateAnd);
        const [result, wrong3] = findConnectedGate(gates, currXor, "XOR", intermediateOr);
        
        const expectedResult = `z${currIndex}`;
        
        [wrong1, wrong2, wrong3].forEach(wrongGate => {
            if (wrongGate) {
                wrongGates.add(wrongGate);
            }
        });
        
        if (result !== expectedResult) {
            wrongGates.add(expectedResult);
        }

        carry = intermediateOr;
    }
    
    return [...wrongGates].sort().join(",");
}
