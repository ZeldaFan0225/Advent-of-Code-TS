export const INPUT_SPLIT = "\n";

const DIRECTIONS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
] as const

export function part_1(input: string[]): number {
    const shortcutsMap: [number, number][] = [
        [2, 0],
        [0, 2],
        [-2, 0],
        [0, -2],
    ]

    return getShortcutsCount(input, shortcutsMap);
}

export function part_2(input: string[]): number {
    const shortcutsMap: [number, number][] = []

    // generate grid to overlay on the map
    const gridSize = 20;
    for(let y = -gridSize; y <= gridSize; y++) {
        let num = gridSize - Math.abs(y)
        for(let x = -num; x <= num; x++) {
            shortcutsMap.push([x, y]);
        }
    }

    return getShortcutsCount(input, shortcutsMap, 100);
}

function getShortcutsCount(input: string[], shortcutDirections: [number, number][], minSaved: number = 100): number {
    const walls = new Set<string>();
    const start: [number, number] = [0, 0];
    const end: [number, number] = [0, 0];

    for(const y in input) {
        const tiles = input[y]!.split("");
        for(const x in tiles) {
            if (tiles[x] === "#") {
                walls.add(`${x},${y}`);
            } else if (tiles[x] === "S") {
                start[0] = parseInt(x);
                start[1] = parseInt(y);
            } else if (tiles[x] === "E") {
                end[0] = parseInt(x);
                end[1] = parseInt(y);
            }
        }
    }
    
    const exploreQueue: [number, number][] = [start];
    const visited = new Set<string>();
    const possibleShortcut = new Map<string, [number]>();
    let score = 0;
    let total = 0;

    let next;
    while((next = exploreQueue.shift()) !== undefined) {
        const [x, y] = next;
        const key = next.join(",");
        if (visited.has(key)) continue;
        visited.add(key);

        if(possibleShortcut.has(key)) {
            const scores = possibleShortcut.get(key)!;
            for(const s of scores) {
                const saved = score - s;
                if(saved >= minSaved) {
                    total++;
                }
            }
        }

        if (x === end[0] && y === end[1]) {
            break;
        }

        for(const [dx, dy] of DIRECTIONS) {
            const nx = x + dx;
            const ny = y + dy;
            const nkey = [nx, ny].join(",");
            if (walls.has(nkey) || visited.has(nkey)) continue;
            exploreQueue.push([nx, ny]);
            // guaranteed to only find one next tile because there is only one path
            break;
        }

        for(const [dx, dy] of shortcutDirections) {
            const nx = x + dx;
            const ny = y + dy;
            const nkey = [nx, ny].join(",");
            if (walls.has(nkey) || visited.has(nkey)) continue;
            const distance = Math.abs(dx) + Math.abs(dy);
            if(possibleShortcut.has(nkey)) {
                const scores = possibleShortcut.get(nkey)!;
                scores.push(score + distance);
            } else {
                possibleShortcut.set(nkey, [score + distance]);
            }
        }

        score++;
    }

    return total;
}