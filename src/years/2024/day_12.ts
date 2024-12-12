export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const visited = new Set<string>();
    let total = 0;
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(!visited.has(`${y},${x}`)) {
                total += calculateFencePricePart1(y, x, input[y]![x]!, input, visited)
            }
        }
    }

    return total
}

function calculateFencePricePart1(y: number, x: number, letter: string, grid: string[], visited: Set<string>): number {
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
        if(nbTop !== letter) perimiter++;
        else queue.push([y-1, x])
        if(nbBottom !== letter) perimiter++;
        else queue.push([y+1, x])
        if(nbLeft !== letter) perimiter++;
        else queue.push([y, x-1])
        if(nbRight !== letter) perimiter++;
        else queue.push([y, x+1])
    }

    return area * perimiter;
}


export function part_2(input: string[]): number {
    const visited = new Set<string>();
    let total = 0;
    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(!visited.has(`${y},${x}`)) {
                total += calculateFencePricePart2(y, x, input[y]![x]!, input, visited)
            }
        }
    }

    return total
}

function calculateFencePricePart2(y: number, x: number, letter: string, grid: string[], visited: Set<string>): number {
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
        if(
            nbTop !== letter &&
            (
                // right turn
                nbRight !== letter ||
                (
                    // left turn
                    nbRight === letter &&
                    grid[y-1]?.[x+1] === letter
                )
            )
        ) perimiter++;
        else queue.push([y-1, x])
        if(
            nbBottom !== letter &&
            (
                // right turn
                nbLeft !== letter || 
                (
                    // left turn
                    nbLeft === letter &&
                    grid[y+1]?.[x-1] === letter
                )
            )
        ) perimiter++;
        else queue.push([y+1, x])
        if(
            nbLeft !== letter &&
            (
                nbTop !== letter ||
                (
                    nbTop === letter &&
                    grid[y-1]?.[x-1] === letter
                )
            )
        ) perimiter++;
        else queue.push([y, x-1])
        if(
            nbRight !== letter &&
            (
                nbBottom !== letter ||
                (
                    nbBottom === letter &&
                    grid[y+1]?.[x+1] === letter
                )
            )
        ) perimiter++;
        else queue.push([y, x+1])
    }

    return area * perimiter;
}