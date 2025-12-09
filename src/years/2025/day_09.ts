export const INPUT_SPLIT = "\n";
function parseCordinates(input: string[]): [number, number][] {
    const coordinates: [number, number][] = [];
    for (const line of input) {
        const [xStr, yStr] = line.split(',') as [string, string];
        coordinates.push([+xStr, +yStr]);
    }
    return coordinates;
}
export function part_1(input: string[]): number {
    const coordinates = parseCordinates(input);
    const sizes = coordinates
        .map(([a, b], i) =>
            coordinates
                .slice(i + 1)
                .map(([c, d]) =>
                    (Math.abs(a - c) + 1) * (Math.abs(b - d) + 1)
                )
        )
        .flat();
    let max = sizes[0] || -1;
    for (let i = 1; i < sizes.length; i++) {
        if (sizes[i]! > max) {
            max = sizes[i]!;
        }
    }
    return max
}

export function part_2(input: string[]): number {
    const coordinates = parseCordinates(input);
    // build map of all edges by following the polygon path
    const xEdgeMap = new Map<number, [number, number][]>(); // vertical edges: x -> [y1, y2]
    const yEdgeMap = new Map<number, [number, number][]>(); // horizontal edges: y -> [x1, x2]
    
    for (let i = 0; i < coordinates.length; i++) {
        const [x1, y1] = coordinates[i]!;
        const [x2, y2] = coordinates[(i + 1) % coordinates.length]!;
        
        if (x1 === x2) {
            // vertical edge
            if (!xEdgeMap.has(x1)) {
                xEdgeMap.set(x1, []);
            }
            xEdgeMap.get(x1)!.push([Math.min(y1, y2), Math.max(y1, y2)]);
        } else {
            // horizontal edge
            if (!yEdgeMap.has(y1)) {
                yEdgeMap.set(y1, []);
            }
            yEdgeMap.get(y1)!.push([Math.min(x1, x2), Math.max(x1, x2)]);
        }
    }
    
    // Pre-sort keys for binary search
    const sortedXKeys = [...xEdgeMap.keys()].sort((a, b) => a - b);
    const sortedYKeys = [...yEdgeMap.keys()].sort((a, b) => a - b);
    
    const sizes = coordinates
        .map(([a, b], i) =>
            coordinates
                .slice(i + 1)
                .map(([c, d]) => {
                    const minX = Math.min(a, c);
                    const maxX = Math.max(a, c);
                    const minY = Math.min(b, d);
                    const maxY = Math.max(b, d);
                    
                    // Check if any vertical edge crosses through the interior of the rectangle
                    for (const x of sortedXKeys) {
                        if (x <= minX) continue;
                        if (x >= maxX) break;
                        // This vertical edge's x is strictly inside the rectangle
                        for (const [y1, y2] of xEdgeMap.get(x)!) {
                            // Check if the edge crosses through the rectangle's y range
                            if (y1 < maxY && y2 > minY) {
                                return -1;
                            }
                        }
                    }
                    
                    // Check if any horizontal edge crosses through the interior of the rectangle
                    for (const y of sortedYKeys) {
                        if (y <= minY) continue;
                        if (y >= maxY) break;
                        // This horizontal edge's y is strictly inside the rectangle
                        for (const [x1, x2] of yEdgeMap.get(y)!) {
                            // Check if the edge crosses through the rectangle's x range
                            if (x1 < maxX && x2 > minX) {
                                return -1;
                            }
                        }
                    }
                    
                    return (Math.abs(a - c) + 1) * (Math.abs(b - d) + 1)
                })
        )
        .flat();
    let max = sizes[0] || -1;
    for (let i = 1; i < sizes.length; i++) {
        if (sizes[i]! > max) {
            max = sizes[i]!;
        }
    }
    return max
}

// 370660 too low