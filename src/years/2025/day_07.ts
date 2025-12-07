export const INPUT_SPLIT = "\n";

export function part_1(input: string[]): number {
    const cleaned = [];
    let startX = -1;
    for(const row of input) {
        if(row.indexOf('S') !== -1) {
            startX = row.indexOf('S');
            continue;
        }
        if(row.indexOf('^') === -1) {
            continue;
        }
        cleaned.push(row);
    }
    let incomingBeams = new Set<number>([startX]);
    let count = 0;
    for(let y = 0; y < cleaned.length; y++) {
        const nextIncomingBeams = new Set<number>();
        for(const beam of incomingBeams) {
            if(cleaned[y]![beam] === '^') {
                count++;
                nextIncomingBeams.add(beam - 1);
                nextIncomingBeams.add(beam + 1);
            } else {
                nextIncomingBeams.add(beam);
            }
        }
        incomingBeams = nextIncomingBeams;
    }
    return count;
}

export function part_2(input: string[]): number {
    const cleaned = [];
    let startX = -1;
    for(const row of input) {
        if(row.indexOf('S') !== -1) {
            startX = row.indexOf('S');
            continue;
        }
        if(row.indexOf('^') === -1) {
            continue;
        }
        cleaned.push(row);
    }
    let pathsAtX = new Map<number, number>([[startX, 1]]);
    for(let y = 0; y < cleaned.length; y++) {
        const nextPathsAtX = new Map<number, number>();
        for(const [beam, paths] of pathsAtX) {
            if(cleaned[y]![beam] === '^') {
                nextPathsAtX.set(beam - 1, (nextPathsAtX.get(beam - 1) ?? 0) + paths);
                nextPathsAtX.set(beam + 1, (nextPathsAtX.get(beam + 1) ?? 0) + paths);
            } else {
                nextPathsAtX.set(beam, (nextPathsAtX.get(beam) ?? 0) + paths);
            }
        }
        pathsAtX = nextPathsAtX;
    }
    let total = 0;
    for(const paths of pathsAtX.values()) {
        total += paths;
    }
    return total;
}