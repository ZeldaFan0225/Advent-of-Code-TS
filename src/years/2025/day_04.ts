export const INPUT_SPLIT = "\n";

function parseMaze(grid: string[], logShift: number): Set<number> {
    const paperRolls = new Set<number>();

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]!;
        for (let x = 0; x < row.length; x++) {
            if (row.charCodeAt(x) === 64) { // '@'
                // pack x and y into one 32-bit int: packed = x | (y << logShift)
                paperRolls.add(x | (y << logShift));
            }
        }
    }
    return paperRolls;
}

function removePaperRolls(paperRolls: Set<number>, logShift: number): number {
    const rowStride = 1 << logShift; // distance between rows in packed space

    // Neighbor positions relative to (x, y):
    // (-1,-1), (-1,0), (-1,1),
    // ( 0,-1),         ( 0,1),
    // ( 1,-1), ( 1,0), ( 1,1)
    //
    // In packed form: packed = x + y*rowStride
    // So neighbor = packed + dx + dy*rowStride
    const neighborOffsets = [
        -rowStride - 1, // (-1, -1)
        -1,             // (-1,  0)
        rowStride - 1,  // (-1,  1)
        -rowStride,     // ( 0, -1)
        rowStride,      // ( 0,  1)
        -rowStride + 1, // ( 1, -1)
        1,              // ( 1,  0)
        rowStride + 1,  // ( 1,  1)
    ];

    const toRemove: number[] = [];

    outer:
    for (const roll of paperRolls) {
        let count = 0;

        // Count how many of the 8 neighbors are present
        for (let i = 0; i < 8; i++) {
            const neighbor = roll + neighborOffsets[i]!;
            if (paperRolls.has(neighbor)) {
                count++;
                if (count >= 4) {
                    // Already enough neighbors to keep this roll
                    continue outer;
                }
            }
        }

        // Fewer than 4 neighbors -> mark for removal
        toRemove.push(roll);
    }

    // Apply removals after the scan so checks see the original set
    for (let i = 0; i < toRemove.length; i++) {
        paperRolls.delete(toRemove[i]!);
    }

    return toRemove.length;
}

export function part_1(input: string[]): number {
    const height = input.length;
    const width = input[0]!.length;

    const maxShift = Math.max(
        Math.ceil(Math.log2(height)),
        Math.ceil(Math.log2(width)),
    );

    const paperRolls = parseMaze(input, maxShift);
    return removePaperRolls(paperRolls, maxShift);
}

export function part_2(input: string[]): number {
    const height = input.length;
    const width = input[0]!.length;

    const maxShift = Math.max(
        Math.ceil(Math.log2(height)),
        Math.ceil(Math.log2(width)),
    );

    const paperRolls = parseMaze(input, maxShift);

    let totalRemoved = 0;
    let lastRemoved = -1;

    while (lastRemoved !== 0) {
        lastRemoved = removePaperRolls(paperRolls, maxShift);
        totalRemoved += lastRemoved;
    }

    return totalRemoved;
}