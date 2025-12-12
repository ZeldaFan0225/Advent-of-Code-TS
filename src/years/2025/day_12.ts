export const INPUT_SPLIT = "\n\n";

type Point = { x: number; y: number };
type Shape = Point[];

// Parse a shape block into a list of relative coordinates
function parseShape(block: string): Shape {
    const lines = block.split("\n").slice(1); // Skip the "N:" header
    const points: Shape = [];
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y]!.trim();
        for (let x = 0; x < line.length; x++) {
            if (line[x] === "#") {
                points.push({ x, y });
            }
        }
    }
    return points;
}

// Normalize a shape so its top-left is at (0,0)
function normalizeShape(shape: Shape): Shape {
    const minX = Math.min(...shape.map(p => p.x));
    const minY = Math.min(...shape.map(p => p.y));
    return shape.map(p => ({ x: p.x - minX, y: p.y - minY }));
}

// Rotate 90 degrees clockwise
function rotateShape(shape: Shape): Shape {
    return normalizeShape(shape.map(p => ({ x: -p.y, y: p.x })));
}

// Flip horizontally
function flipShape(shape: Shape): Shape {
    return normalizeShape(shape.map(p => ({ x: -p.x, y: p.y })));
}

// Get all unique orientations of a shape (rotations + flips)
function getAllOrientations(shape: Shape): Shape[] {
    const orientations: Shape[] = [];
    const seen = new Set<string>();

    let current = shape;
    for (let flip = 0; flip < 2; flip++) {
        for (let rot = 0; rot < 4; rot++) {
            const normalized = normalizeShape(current);
            const key = JSON.stringify(normalized.sort((a, b) => a.y - b.y || a.x - b.x));
            if (!seen.has(key)) {
                seen.add(key);
                orientations.push(normalized);
            }
            current = rotateShape(current);
        }
        current = flipShape(shape);
    }
    return orientations;
}

// Get all valid placements of a shape orientation on a grid
function getValidPlacements(shape: Shape, width: number, height: number): Point[] {
    const maxX = Math.max(...shape.map(p => p.x));
    const maxY = Math.max(...shape.map(p => p.y));
    const placements: Point[] = [];

    for (let y = 0; y <= height - maxY - 1; y++) {
        for (let x = 0; x <= width - maxX - 1; x++) {
            placements.push({ x, y });
        }
    }
    return placements;
}

// Check if a shape can be placed at a position on the grid
function canPlace(grid: number[][], shape: Shape, pos: Point): boolean {
    for (const p of shape) {
        if (grid[pos.y + p.y]![pos.x + p.x] !== 0) {
            return false;
        }
    }
    return true;
}

// Place a shape on the grid
function placeShape(grid: number[][], shape: Shape, pos: Point, value: number): void {
    for (const p of shape) {
        grid[pos.y + p.y]![pos.x + p.x] = value;
    }
}

// Remove a shape from the grid
function removeShape(grid: number[][], shape: Shape, pos: Point): void {
    for (const p of shape) {
        grid[pos.y + p.y]![pos.x + p.x] = 0;
    }
}

// Backtracking solver
function solve(
    grid: number[][],
    width: number,
    height: number,
    shapesToPlace: Shape[][],  // For each shape to place, all its orientations
    index: number
): boolean {
    if (index >= shapesToPlace.length) {
        return true; // All shapes placed successfully
    }

    const orientations = shapesToPlace[index]!;

    for (const orientation of orientations) {
        const placements = getValidPlacements(orientation, width, height);

        for (const pos of placements) {
            if (canPlace(grid, orientation, pos)) {
                placeShape(grid, orientation, pos, index + 1);

                if (solve(grid, width, height, shapesToPlace, index + 1)) {
                    return true;
                }

                removeShape(grid, orientation, pos);
            }
        }
    }

    return false;
}

export function part_1(input: string[]): number {
    // Parse shapes
    const shapes = input.slice(0, -1).map(parseShape);
    const shapeOrientations = shapes.map(getAllOrientations);

    // Parse trees (regions)
    const trees = input[input.length - 1]!.split("\n").map(line => {
        const [dimensions, indexCounts] = line.split(": ") as [string, string];
        const [width, height] = dimensions.split("x").map(Number) as [number, number];
        const counts = indexCounts.split(" ").map(Number);
        return { width, height, counts };
    });

    const shapesSizes = shapes.map(s => s.length);
    let count = 0;

    for (const tree of trees) {
        const spaceAvail = tree.width * tree.height;
        const shapeSizeRequested = tree.counts.map((c, i) => c * shapesSizes[i]!).reduce((a, b) => a + b, 0);

        // Quick check: if shapes don't fit by area, skip
        if (shapeSizeRequested > spaceAvail) {
            continue;
        }

        // Build list of shapes to place (expanding counts)
        const shapesToPlace: Shape[][] = [];
        for (let i = 0; i < tree.counts.length; i++) {
            const c = tree.counts[i]!;
            for (let j = 0; j < c; j++) {
                shapesToPlace.push(shapeOrientations[i]!);
            }
        }

        // If no shapes to place, it's trivially solvable
        if (shapesToPlace.length === 0) {
            count++;
            continue;
        }

        // Create empty grid
        const grid: number[][] = Array.from({ length: tree.height }, () =>
            Array.from({ length: tree.width }, () => 0)
        );

        // Sort shapes by number of valid placements (fewest first - MRV heuristic)
        const shapesWithPlacements = shapesToPlace.map((orientations, idx) => {
            let totalPlacements = 0;
            for (const o of orientations) {
                totalPlacements += getValidPlacements(o, tree.width, tree.height).length;
            }
            return { orientations, totalPlacements, idx };
        });
        shapesWithPlacements.sort((a, b) => a.totalPlacements - b.totalPlacements);
        const sortedShapes = shapesWithPlacements.map(s => s.orientations);

        if (solve(grid, tree.width, tree.height, sortedShapes, 0)) {
            count++;
        }
    }

    return count;
}


export function part_2(input: string): string {
    return "Merry Christmas!";
}