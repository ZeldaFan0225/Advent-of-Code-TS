interface Path {
    coordinates: [number, number];
    direction: string;
    score: number;
}

const MOVEMENTS = [
    [0, -1, "^"],
    [1, 0, ">"],
    [0, 1, "v"],
    [-1, 0, "<"],
] as const;

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const walls = new Set<string>();
    const queue: Path[] = [];
    const end: [number, number] = [0, 0];
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            switch(input[y]![x]) {
                case "#": {
                    walls.add(`${x},${y}`);
                    break;
                }
                case "S": {
                    queue.push({coordinates: [x, y], direction: ">", score: 0});
                    break;
                }
                case "E": {
                    end[0] = x;
                    end[1] = y;
                    break;
                }
            }
        }
    }

    const visited = new Map<string, number>();

    let current;
    let lowest = Infinity;
    while((current = queue.shift()) !== undefined) {
        console.log(queue.length);
        const [x, y] = current.coordinates;
        if(x === end[0] && y === end[1]) {
            //printPath(current!, walls, input[0]!.length, input.length);
            if(current.score < lowest) {
                lowest = current.score;
            }
            continue;
        }
        const key = `${x},${y},${current.direction}`;
        if(visited.has(key)) {
            if(visited.get(key)! <= current.score) {
                // if current score is higher, we don't need to continue
                continue;
            }
        }
        visited.set(key, current.score);
        
        for(const [dx, dy, dir] of MOVEMENTS) {
            const newX = x + dx;
            const newY = y + dy;
            const newVisited = `${newX},${newY}`;
            if(walls.has(newVisited)) {
                continue;
            }

            let newScore = current.score;

            if(dir === current.direction) {
                newScore += 1;
            } else if(
                current.direction === "<" && dir === ">" ||
                current.direction === ">" && dir === "<" ||
                current.direction === "^" && dir === "v" ||
                current.direction === "v" && dir === "^"
            ) {
                // moving back not allowed, because it makes no sense
                continue;
            } else {
                // turning and moving there
                newScore += 1001;
            }
            queue.push({coordinates: [newX, newY], direction: dir, score: newScore});
        }
    }

    return lowest;
}


interface ExtendedPath extends Path {
    path: string[];
}

export function part_2(input: string[]): number {
    const walls = new Set<string>();
    const queue: ExtendedPath[] = [];
    const end: [number, number] = [0, 0];
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            switch(input[y]![x]) {
                case "#": {
                    walls.add(`${x},${y}`);
                    break;
                }
                case "S": {
                    queue.push({coordinates: [x, y], direction: ">", score: 0, path: ["0,0,>"]});
                    break;
                }
                case "E": {
                    end[0] = x;
                    end[1] = y;
                    break;
                }
            }
        }
    }

    const visited = new Map<string, number>();

    let current;
    let lowest = Infinity;
    let lowestPaths: ExtendedPath[] = [];
    while((current = queue.shift()) !== undefined) {
        const [x, y] = current.coordinates;
        if(x === end[0] && y === end[1]) {
            if(current.score < lowest) {
                lowestPaths = [current];
                lowest = current.score;
            } else if(current.score === lowest) {
                lowestPaths.push(current);
            }
            continue;
        }
        const key = `${x},${y},${current.direction}`;
        if(visited.has(key)) {
            if(visited.get(key)! < current.score) {
                // if current score is higher, we don't need to continue
                continue;
            }
        }
        visited.set(key, current.score);
        
        for(const [dx, dy, dir] of MOVEMENTS) {
            const newX = x + dx;
            const newY = y + dy;
            const newVisited = `${newX},${newY}`;
            if(walls.has(newVisited)) {
                continue;
            }

            let newScore = current.score;

            if(dir === current.direction) {
                newScore += 1;
            } else if(
                current.direction === "<" && dir === ">" ||
                current.direction === ">" && dir === "<" ||
                current.direction === "^" && dir === "v" ||
                current.direction === "v" && dir === "^"
            ) {
                // moving back not allowed, because it makes no sense
                continue;
            } else {
                // turning and moving there
                newScore += 1001;
            }
            queue.push({coordinates: [newX, newY], direction: dir, score: newScore, path: [...current.path, `${newX},${newY},${dir}`]});
        }
    }

    let tiles = new Set<string>();
    for(const path of lowestPaths) {
        for(const step of path.path) {
            tiles.add(step.slice(0, -2));
        }
    }

    return tiles.size;
}