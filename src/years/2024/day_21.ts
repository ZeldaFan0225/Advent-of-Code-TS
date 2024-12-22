interface Pos {
    x: number;
    y: number;
}

interface E {
    p: Pos;
    path: Pos[];
}

export const INPUT_SPLIT = "\n";

// Extracted BFS into a helper function
function findAllPaths(start: Pos, end: Pos, grid: string[], width: number, height: number): string[] {
    // Helper to add positions
    const plus = (p1: Pos, p2: Pos): Pos => ({ x: p1.x + p2.x, y: p1.y + p2.y });
    // Helper to check boundaries
    const inRange = (pos: Pos): boolean =>
        pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;

    const queue: E[] = [{ p: start, path: [start] }];
    const paths: string[] = [];

    while (queue.length) {
        const current = queue.shift()!;
        // If we've reached our destination, build the move string
        if (current.p.x === end.x && current.p.y === end.y) {
            let moves = "";
            for (let i = 0; i < current.path.length - 1; i++) {
                const p1 = current.path[i]!;
                const p2 = current.path[i + 1]!;
                if (p1.y === p2.y) {
                    moves += (p1.x < p2.x) ? ">" : "<";
                } else {
                    moves += (p1.y < p2.y) ? "v" : "^";
                }
            }
            // Append 'A' at the end
            moves += "A";
            paths.push(moves);
            continue;
        }

        // Enqueue neighbors
        for (const d of [{ x:1, y:0 }, { x:0, y:1 }, { x:-1, y:0 }, { x:0, y:-1 }]) {
            const nextPos = plus(current.p, d);
            if (!inRange(nextPos)) continue;
            if (grid[nextPos.y]![nextPos.x]! === " ") continue;
            if (current.path.some(p => p.x === nextPos.x && p.y === nextPos.y)) continue;

            queue.push({ p: nextPos, path: [...current.path, nextPos] });
        }
    }
    return paths;
}

// Simplified computePaths to call findAllPaths
function computePaths(pad: string): Map<string, string[]> {
    const paths = new Map<string, string[]>();
    const grid = pad.split("\n");
    const width = grid[0]!.length;
    const height = grid.length;

    // Gather all non-space positions
    const positions: Pos[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grid[y]![x]! !== " ") positions.push({ x, y });
        }
    }

    // For each pair of non-space positions, find BFS paths
    for (const start of positions) {
        const c1 = grid[start.y]![start.x]!;
        // Put a trivial path from c1 to itself
        paths.set(`${c1}${c1}`, ["A"]);

        for (const end of positions) {
            if (start.x === end.x && start.y === end.y) continue;
            const c2 = grid[end.y]![end.x]!;
            const allPaths = findAllPaths(start, end, grid, width, height);

            // Sort by length; store only shortest
            allPaths.sort((a, b) => a.length - b.length);
            const shortestLen = allPaths[0]!.length;
            paths.set(`${c1}${c2}`, allPaths.filter(p => p.length === shortestLen));
        }
    }
    return paths;
}

function findSeq(code: string, paths: Map<string, string[]>): string[] {
    let key = 'A';
    let seqs: string[] = [''];
    
    for (let i = 0; i < code.length; i++) {
        const c = code[i]!;
        const newSeqs: string[] = [];
        
        for (const seq of seqs) {
            const pathKey = `${key}${c}`;
            const possiblePaths = paths.get(pathKey) || [];
            for (const path of possiblePaths) {
                newSeqs.push(seq + path);
            }
        }
        
        key = c;
        seqs = newSeqs;
    }
    
    return seqs;
}

function calcCosts(dirPaths: Map<string, string[]>, nRobots: number): Map<string, number> {
    let minCosts = new Map<string, number>();
    
    for (const [key, paths] of dirPaths.entries()) {
        minCosts.set(key, Math.min(...paths.map(p => p.length)));
    }

    for (let robot = 0; robot < nRobots - 1; robot++) {
        const newMinCosts = new Map<string, number>();
        
        for (const [pair, paths] of dirPaths.entries()) {
            let minCost = Number.MAX_SAFE_INTEGER;
            
            for (const path of paths) {
                let key = 'A';
                let cost = 0;
                
                for (let i = 0; i < path.length; i++) {
                    const c = path[i]!;
                    const costKey = `${key}${c}`;
                    cost += minCosts.get(costKey) || 0;
                    key = c;
                }
                
                minCost = Math.min(minCost, cost);
            }
            
            if (minCost === Number.MAX_SAFE_INTEGER) {
                throw new Error("No valid path found");
            }
            
            newMinCosts.set(pair, minCost);
        }
        
        minCosts = newMinCosts;
    }

    return minCosts;
}

export function part_1(input: string[]): number {
    const numPad = `789
456
123
 0A`;

    const numPaths = computePaths(numPad);
    const dirPad = ` ^A
<v>`;

    const dirPaths = computePaths(dirPad);
    const costs = calcCosts(dirPaths, 2);

    let s = 0;
    for (const code of input) {
        const seqs = findSeq(code, numPaths);
        let minCost = Number.MAX_SAFE_INTEGER;

        for (const seq of seqs) {
            let key = 'A';
            let cost = 0;

            for (let i = 0; i < seq.length; i++) {
                const c = seq[i]!;
                const costKey = `${key}${c}`;
                cost += costs.get(costKey) || 0;
                key = c;
            }

            minCost = Math.min(minCost, cost);
        }

        if (minCost === Number.MAX_SAFE_INTEGER) {
            throw new Error("No valid path found");
        }

        const iPart = parseInt(code.substring(0, 3));
        s += iPart * minCost;
    }

    return s;
}

export function part_2(input: string[]): number {
    const numPad = `789
456
123
 0A`;

    const numPaths = computePaths(numPad);
    const dirPad = ` ^A
<v>`;

    const dirPaths = computePaths(dirPad);
    const costs = calcCosts(dirPaths, 25);

    let s = 0;
    for (const code of input) {
        const seqs = findSeq(code, numPaths);
        let minCost = Number.MAX_SAFE_INTEGER;

        for (const seq of seqs) {
            let key = 'A';
            let cost = 0;

            for (let i = 0; i < seq.length; i++) {
                const c = seq[i]!;
                const costKey = `${key}${c}`;
                cost += costs.get(costKey) || 0;
                key = c;
            }

            minCost = Math.min(minCost, cost);
        }

        if (minCost === Number.MAX_SAFE_INTEGER) {
            throw new Error("No valid path found");
        }

        const iPart = parseInt(code.substring(0, 3));
        s += iPart * minCost;
    }

    return s;
}