export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const visited = new Set<string>();
    let total = 0;
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(!visited.has(`${y},${x}`)) {
                total += calculateFencePrice(y, x, input[y]![x]!, input, visited, 1)
            }
        }
    }

    return total
}

export function part_2(input: string[]): number {
    const visited = new Set<string>();
    let total = 0;
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(!visited.has(`${y},${x}`)) {
                total += calculateFencePrice(y, x, input[y]![x]!, input, visited, 2)
            }
        }
    }

    return total
}

function calculateFencePrice(y: number, x: number, letter: string, grid: string[], visited: Set<string>, part: 1 | 2): number {
    let queue: [number, number][] = [[y, x]]
    let area = 0;
    let perimiter = 0;
    while(queue.length) {
        const next = queue.shift()!;
        const [y, x] = next
        if(visited.has(`${y},${x}`)) {
            continue;
        }
        visited.add(`${y},${x}`)
        area++;
        const nbTop = grid[y-1]?.[x]
        const nbBottom = grid[y+1]?.[x]
        const nbLeft = grid[y]?.[x-1]
        const nbRight = grid[y]?.[x+1]
        // only add on "right turns" or "left turns"
        if(nbTop !== letter) {
            if(
                part === 1 ||
                // right turn
                nbRight !== letter ||
                (
                    // left turn
                    nbRight === letter &&
                    grid[y-1]?.[x+1] === letter
                )
            ) perimiter++;
        }
        else queue.push([y-1, x])
        if(nbBottom !== letter) {
            if(
                part === 1 ||
                // right turn
                nbLeft !== letter || 
                (
                    // left turn
                    nbLeft === letter &&
                    grid[y+1]?.[x-1] === letter
                )
            ) perimiter++;
        }
        else queue.push([y+1, x])
        if(nbLeft !== letter) {
            if(
                part === 1 ||
                nbTop !== letter ||
                (
                    nbTop === letter &&
                    grid[y-1]?.[x-1] === letter
                )
            ) perimiter++;
        }
        else queue.push([y, x-1])
        if(nbRight !== letter) {
            if(
                part === 1 ||
                nbBottom !== letter ||
                (
                    nbBottom === letter &&
                    grid[y+1]?.[x+1] === letter
                )
            ) perimiter++;
        }
        else queue.push([y, x+1])
    }

    return area * perimiter;
}