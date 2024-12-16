import * as fs from 'fs';

interface Instruction {
    coordinates: [number, number];
    direction: string;
    score: number;
    path: string[];
}

function log(message: string) {
    //console.log(message);
    //fs.appendFileSync('output.txt', message + '\n');
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    // Clear the output file at the start
    fs.writeFileSync('output.txt', '');

    let exploreNext: Instruction[] = [];
    let goal: [number, number] = [0, 0];
    const explored = new Map<string, Set<string>>();
    let bestPath: string[] = [];

    const grid = input.map((line, i) => {
        const cells = line.split('');
        const sIndex = cells.indexOf("S")
        if(sIndex !== -1) {
            // Start exploring in all four directions
            exploreNext.push({
                    coordinates: [i, sIndex],
                    direction: ">",
                    score: 0,
                    path: [`${i},${sIndex},>`]
                }
            );
            cells[sIndex] = "."
        }
        const eIndex = cells.indexOf('E')
        if(eIndex !== -1) {
            goal = [i, eIndex];
            cells[eIndex] = "."
        }
        return cells;
    });

    let lowest = Infinity;

    while(exploreNext.length > 0) {
        const current = exploreNext.shift()!;
        const [y, x] = current.coordinates;
        const key = `${y},${x}`;
        
        // Track direction with position to allow different approaches to same cell
        if(!explored.has(key)) {
            explored.set(key, new Set());
        }
        if(explored.get(key)!.has(current.direction)) {
            continue;
        }
        explored.get(key)!.add(current.direction);

        if(y === goal[0] && x === goal[1]) {
            if(current.score < lowest) {
                lowest = current.score;
                bestPath = current.path;
            }
            continue;
        }

        const directions: [number, number, string][] = [
            [0, 1, ">"],   // right
            [0, -1, "<"],  // left
            [1, 0, "v"],   // down
            [-1, 0, "^"]   // up
        ];

        for(const [dy, dx, dir] of directions) {
            const newY = y + dy;
            const newX = x + dx;
            
            // Check if new position is valid and not a wall
            const row = grid[newY];
            if(!row || row[newX] === undefined || row[newX] === "#") {
                continue;
            }

            let newScore = current.score;
            
            // If continuing in same direction, add 1
            // If turning, add 1000
            if(
                (current.direction === ">" && dir === ">") ||
                (current.direction === "<" && dir === "<") ||
                (current.direction === "^" && dir === "^") ||
                (current.direction === "v" && dir === "v")
            ) {
                newScore += 1;
            } else {
                newScore += 1001;
            }

            exploreNext.push({
                coordinates: [newY, newX],
                direction: dir,
                score: newScore,
                path: [...current.path, `${newY},${newX},${dir}`]
            });
        }

        // Sort by score to explore lower-cost paths first
        exploreNext.sort((a, b) => a.score - b.score);
    }

    // Print the best path
    log("Best path:");
    const visualGrid = grid.map(row => [...row]);
    bestPath.forEach(step => {
        const parts = step.split(',');
        if (parts.length === 3) {
            const y = Number(parts[0]);
            const x = Number(parts[1]);
            const dir = parts[2];
            if (dir && visualGrid[y] && visualGrid[y]?.[x] !== undefined) {
                visualGrid[y]![x] = dir;
            }
        }
    });
    log(visualGrid.map(row => row.join('')).join('\n'));
    log(`Total cost: ${lowest}`);

    return lowest;
}

export function part_2(input: string[]): number {
    // Clear the output file at the start
    fs.writeFileSync('output.txt', '');

    let exploreNext: Instruction[] = [];
    let goal: [number, number] = [0, 0];
    // Track visited states and their scores
    const visited = new Map<string, number>();
    let bestPaths: string[][] = [];
    let lowest = Infinity;

    const grid = input.map((line, i) => {
        const cells = line.split('');
        const sIndex = cells.indexOf("S")
        if(sIndex !== -1) {
            exploreNext.push({
                coordinates: [i, sIndex],
                direction: ">",
                score: 0,
                path: [`${i},${sIndex},>`]
            });
            cells[sIndex] = "."
        }
        const eIndex = cells.indexOf('E')
        if(eIndex !== -1) {
            goal = [i, eIndex];
            cells[eIndex] = "."
        }
        return cells;
    });

    // Calculate maximum reasonable path length
    const maxPathLength = grid.length * grid[0]!.length * 4;  // 4 directions per cell

    function printCurrentPath(current: Instruction) {
        const visualGrid = grid.map(row => [...row]);
        current.path.forEach(step => {
            const parts = step.split(',');
            if (parts.length === 3) {
                const y = Number(parts[0]);
                const x = Number(parts[1]);
                const dir = parts[2];
                if (dir && visualGrid[y] && visualGrid[y]?.[x] !== undefined) {
                    visualGrid[y]![x] = dir;
                }
            }
        });
        return visualGrid.map(row => row.join('')).join('\n');
    }

    while(exploreNext.length > 0) {
        const current = exploreNext.shift()!;
        const [y, x] = current.coordinates;
        
        // Skip if path is too long (prevents infinite loops)
        if(current.path.length > maxPathLength) {
            continue;
        }

        // Create a unique key for this state
        const stateKey = `${y},${x},${current.direction}`;
        
        // Check if we've seen this state before with a better or equal score
        const existingScore = visited.get(stateKey);
        if(existingScore !== undefined && current.score > existingScore) {
            continue;
        }
        
        // Update the best score for this state
        visited.set(stateKey, current.score);

        if(y === goal[0] && x === goal[1]) {
            if(current.score <= lowest) {
                if(current.score < lowest) {
                    log(`Found new best path to goal with score ${current.score}`);
                    lowest = current.score;
                    bestPaths = [current.path];
                } else {
                    log(`Found another path to goal with equal best score ${current.score}`);
                    bestPaths.push(current.path);
                }
            }
            continue;
        }

        const directions: [number, number, string][] = [
            [0, 1, ">"],   // right
            [0, -1, "<"],  // left
            [1, 0, "v"],   // down
            [-1, 0, "^"]   // up
        ];

        for(const [dy, dx, dir] of directions) {
            const newY = y + dy;
            const newX = x + dx;
            
            // Check if new position is valid and not a wall
            const row = grid[newY];
            if(!row || row[newX] === undefined || row[newX] === "#") {
                continue;
            }

            let newScore = current.score;
            
            // If continuing in same direction, add 1
            // If turning, add 1000
            if(
                (current.direction === ">" && dir === ">") ||
                (current.direction === "<" && dir === "<") ||
                (current.direction === "^" && dir === "^") ||
                (current.direction === "v" && dir === "v")
            ) {
                newScore += 1;
            } else if(
                (current.direction === "<" && dir === ">") ||
                (current.direction === ">" && dir === "<") ||
                (current.direction === "v" && dir === "^") ||
                (current.direction === "^" && dir === "v")
            ) {
                continue;
            } else {
                newScore += 1001;
            }

            // Only add new path if it's not worse than what we've seen
            const newStateKey = `${newY},${newX},${dir}`;
            const newStateScore = visited.get(newStateKey);
            if(newStateScore === undefined || newScore <= newStateScore) {
                exploreNext.push({
                    coordinates: [newY, newX],
                    direction: dir,
                    score: newScore,
                    path: [...current.path, `${newY},${newX},${dir}`]
                });
            }
        }

        // Sort by score to explore lower-cost paths first
        exploreNext.sort((a, b) => a.score - b.score);
    }

    // Collect all unique tiles from all best paths
    const uniqueTiles = new Set<string>();
    bestPaths.forEach(path => {
        path.forEach(step => {
            const [y, x] = step.split(',');
            uniqueTiles.add(`${y},${x}`);
        });
    });

    // Print visualization of used tiles
    log("\nFinal Results:");
    log("Used tiles (O):");
    const visualGrid = grid.map(row => [...row]);
    uniqueTiles.forEach(tile => {
        const [y, x] = tile.split(',').map(Number) as [number, number];
        if (visualGrid[y] && visualGrid[y]?.[x] !== undefined) {
            visualGrid[y]![x] = "O";
        }
    });
    log(visualGrid.map(row => row.join('')).join('\n'));

    log(`Found ${bestPaths.length} paths with lowest cost ${lowest}`);
    log(`Number of unique tiles visited: ${uniqueTiles.size}`);

    return uniqueTiles.size;
}
