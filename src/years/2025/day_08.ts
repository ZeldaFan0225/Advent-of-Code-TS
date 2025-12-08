export const INPUT_SPLIT = "\n";

interface JunctionBox {
    x: number;
    y: number;
    z: number;
    circuitIndex?: number;
}

function distance(a: JunctionBox, b: JunctionBox): number {
    //return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

function parseJunctionBoxes(input: string[]): JunctionBox[] {
    const boxes: JunctionBox[] = [];
    for(const line of input) {
        const [xStr, yStr, zStr] = line.split(',') as [string, string, string];
        boxes.push({
            x: parseInt(xStr, 10),
            y: parseInt(yStr, 10),
            z: parseInt(zStr, 10),
        });
    }
    return boxes;
}

function kruskalsAlgorithm(boxes: JunctionBox[], maxConnections: number) {
    if(maxConnections === -1) {
        maxConnections = (Math.pow(boxes.length, 2) - boxes.length)/2;
    }
    const circuits: JunctionBox[][] = [];
    for(const box of boxes) {
        box.circuitIndex = circuits.length;
        circuits.push([box]);
    }

    const pairs = boxes.map((a, i) => boxes.slice(i + 1).map(b => ({a, b}))).flat().sort((pairA, pairB) => {
        return distance(pairA.a, pairA.b) - distance(pairB.a, pairB.b);
    });

    const iterations = Math.min(pairs.length, maxConnections);
    let lastConnected: [JunctionBox, JunctionBox] | null = null;
    for(let i = 0; i < iterations; i++) {
        const pair = pairs[i]!;
        if(pair.a.circuitIndex !== pair.b.circuitIndex) {
            const circuitA = circuits[pair.a.circuitIndex!]!;
            const circuitB = circuits[pair.b.circuitIndex!]!;
            const newCircuitIndex = Math.min(pair.a.circuitIndex!, pair.b.circuitIndex!);
            const oldCircuitIndex = Math.max(pair.a.circuitIndex!, pair.b.circuitIndex!);
            for(const box of circuitA) {
                box.circuitIndex = newCircuitIndex;
            }
            for(const box of circuitB) {
                box.circuitIndex = newCircuitIndex;
            }
            circuits[newCircuitIndex] = circuitA.concat(circuitB);
            circuits[oldCircuitIndex] = [];
            lastConnected = [pair.a, pair.b];
        }
    }
    
    // Get sizes of all non-empty circuits, sort descending
    const sizes = circuits.map(c => c.length).filter(l => l > 0).sort((a, b) => b - a);
    return {
        part1: sizes[0]! * sizes[1]! * sizes[2]!,
        part2: lastConnected![0]!.x * lastConnected![1]!.x
    };
}


export function part_1(input: string[]): number {
    const boxes = parseJunctionBoxes(input);
    // 10 for example, 1000 for real input
    const maxConnections = boxes.length <= 20 ? 10 : 1000;
    return kruskalsAlgorithm(boxes, maxConnections).part1;
}


export function part_2(input: string[]): number {
    const boxes = parseJunctionBoxes(input);
    return kruskalsAlgorithm(boxes, -1).part2;
}