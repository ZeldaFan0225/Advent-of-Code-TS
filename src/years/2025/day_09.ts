export const INPUT_SPLIT = "\n";
function parseCordinates(input: string[]): [number, number][] {
    const coordinates: [number, number][] = [];
    for(const line of input) {
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
                    (Math.abs(a - c)+1) * (Math.abs(b - d)+1)
            )
        )
        .flat();
    let max = sizes[0] || -1;
    for(let i = 1; i < sizes.length; i++) {
        if(sizes[i]! > max) {
            max = sizes[i]!;
        }
    }
    return max
}

export function part_2(input: string): number {
    return input.length
}