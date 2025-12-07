export const INPUT_SPLIT = "\n";

/**
 * Reads in the manifold and removes rows without splitters.
 * @param input 
 * @returns 
 */
function parseManifold(input: string[]): { start: number, splitters: Set<number>, width: number, height: number, maxShift: number } {
    const height = input.length;
    const width = input[0]!.length;

    const maxShift = Math.ceil(Math.log2(height));
    let start = -1;
    let splitters: Set<number> = new Set<number>();
    let actualY = 0;

    for (let y = 0; y < height; y++) {
        const line = input[y]!;
        if(line.indexOf('^') === -1 && line.indexOf('S') === -1) {
            continue;
        }
        actualY++;
        for(let x = 0; x < width; x++) {
            switch(line.charAt(x)) {
                case 'S':
                    start = actualY + (x << maxShift);
                    break;
                case '^':
                    splitters.add(actualY + (x << maxShift));
                    break;
            }
        }
    }
    return { start, splitters, width, height: actualY+1, maxShift };
}

function prettyPrintPackedCoordinates(packed: number, maxShift: number): string {
    const x = packed >> maxShift;
    const y = packed & ((1 << maxShift) - 1);
    return `(x:${x},y:${y})`;
}

function prettyPrintMap(explored: Set<number>, splitters: Set<number>, width: number, height: number, maxShift: number): string {
    let output = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const packed = y + (x << maxShift);
            if(explored.has(packed)) {
                output += "|"
            } else if(splitters.has(packed)) {
                output += '^';
            } else {
                output += '.';
            }
        }
        output += '\n';
    }
    console.log(output);
    return output;
}

export function part_1(input: string[]): number {
    const {
        start, splitters, width, height, maxShift
    } = parseManifold(input);
    const a = console.log;
    console.log = () => {};
    const queue = [start];
    const explored = new Set<number>([start]);
    let splitterCount = 0;
    while(queue.length) {
        prettyPrintMap(explored, splitters, width, height, maxShift);
        const current = queue.shift()!;
        // bottom reached
        if((current & ((1 << maxShift) - 1)) === height - 1) {
            continue;
        }
        const next = current + 1;
        console.log({ current: prettyPrintPackedCoordinates(current, maxShift), next: prettyPrintPackedCoordinates(next, maxShift) });
        if(splitters.has(next)) {
            console.log(`Reached splitter at ${prettyPrintPackedCoordinates(next, maxShift)}`);
            const x = current >> maxShift;
            const y = current & ((1 << maxShift) - 1);
            console.log(x, y);
            splitterCount++;
                const left = y + ((x - 1) << maxShift);
            if(x > 0 && !explored.has(left)) {
                queue.push(left);
            }
            const right = y + ((x + 1) << maxShift);
            if(x < width - 1 && !explored.has(right)) {
                queue.push(right);
            }
        } else {
            if(!explored.has(next)) {
                queue.push(next);
                explored.add(next);
            }
        }
    }

    console.log({ start, splitters: [...splitters].map(n => prettyPrintPackedCoordinates(n, maxShift)), width, height, maxShift });
    console.log = a;
    return splitterCount
}

// idea: parse maze as tree structure with splittters as branches

export function part_2(input: string[]): number {
    return input.length
}