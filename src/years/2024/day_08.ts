export const INPUT_SPLIT = "\n";
type Coordinate = [number, number];
export function part_1(input: string[], visualize?: boolean): number {
    const antennaMap = new Map<string, Coordinate[]>();
    const antiNodes = new Set<string>();

    const mapWidth = input[0]!.length;
    const mapHeight = input.length;

    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(input[y]![x] !== ".") {
                const antennas = antennaMap.get(input[y]![x]!);
                if(!antennas) {
                    antennaMap.set(input[y]![x]!, [[y, x]]);
                } else {
                    antennas.push([y, x]);
                }
            }
        }
    }

    for(const antennas of antennaMap.values()) {
        if(antennas.length <= 1) {
            continue;
        }
        for(const [y, x] of antennas) {
            for(const [y2, x2] of antennas) {
                if(y === y2 && x === x2) {
                    continue;
                }
                // Calculate antinode
                const antinode1x = x + (x - x2);
                const antinode1y = y + (y - y2);
                const antinode2x = x2 + (x2 - x);
                const antinode2y = y2 + (y2 - y);

                // Check bounds
                if(
                    antinode1x >= 0 && antinode1x < mapWidth && antinode1y >= 0 && antinode1y < mapHeight
                ) {
                    antiNodes.add(`${antinode1y},${antinode1x}`);
                }
                if(
                    antinode2x >= 0 && antinode2x < mapWidth && antinode2y >= 0 && antinode2y < mapHeight
                ) {
                    antiNodes.add(`${antinode2y},${antinode2x}`);
                }
            }
        }
    }
    
    if(visualize) printMap(antennaMap, antiNodes, mapWidth, mapHeight);
    
    return antiNodes.size;
}

export function part_2(input: string[], visualize?: boolean): number {
    const antennaMap = new Map<string, Coordinate[]>();
    const antiNodes = new Set<string>();

    const mapWidth = input[0]!.length;
    const mapHeight = input.length;

    for(let y = 0; y < input.length; y++) {
        for(let x = 0; x < input[y]!.length; x++) {
            if(input[y]![x] !== ".") {
                const antennas = antennaMap.get(input[y]![x]!);
                if(!antennas) {
                    antennaMap.set(input[y]![x]!, [[y, x]]);
                } else {
                    antennas.push([y, x]);
                }
            }
        }
    }

    for(const antennas of antennaMap.values()) {
        if(antennas.length <= 1) {
            continue;
        }
        for(const [y, x] of antennas) {
            for(const [y2, x2] of antennas) {
                if(y === y2 && x === x2) {
                    continue;
                }
                // The antennas themselves are antinodes
                antiNodes.add(`${y},${x}`);
                antiNodes.add(`${y2},${x2}`);

                let diffX = x - x2;
                let diffY = y - y2;
                let multiplier = 1;
                while(
                    x + diffX * multiplier >= 0 && x + diffX * multiplier < mapWidth &&
                    y + diffY * multiplier >= 0 && y + diffY * multiplier < mapHeight
                ) {
                    antiNodes.add(`${y + diffY * multiplier},${x + diffX * multiplier}`);
                    multiplier++;
                }
                multiplier = -1;
                while(
                    x + diffX * multiplier >= 0 && x + diffX * multiplier < mapWidth &&
                    y + diffY * multiplier >= 0 && y + diffY * multiplier < mapHeight
                ) {
                    antiNodes.add(`${y + diffY * multiplier},${x + diffX * multiplier}`);
                    multiplier--;
                }
                multiplier = 1;
                while(
                    x2 + diffX * multiplier >= 0 && x2 + diffX * multiplier < mapWidth &&
                    y2 + diffY * multiplier >= 0 && y2 + diffY * multiplier < mapHeight
                ) {
                    antiNodes.add(`${y2 + diffY * multiplier},${x2 + diffX * multiplier}`);
                    multiplier++;
                }
                multiplier = -1;
                while(
                    x2 + diffX * multiplier >= 0 && x2 + diffX * multiplier < mapWidth &&
                    y2 + diffY * multiplier >= 0 && y2 + diffY * multiplier < mapHeight
                ) {
                    antiNodes.add(`${y2 + diffY * multiplier},${x2 + diffX * multiplier}`);
                    multiplier--;
                }
            }
        }
    }

    if(visualize) printMap(antennaMap, antiNodes, mapWidth, mapHeight);
    
    return antiNodes.size;
}


function printMap(antennaMap: Map<string, Coordinate[]>, antiNodes: Set<string>, mapWidth: number, mapHeight: number) {
    for(let y = 0; y < mapHeight; y++) {
        let row = "";
        for(let x = 0; x < mapWidth; x++) {
            const key = `${y},${x}`;
            if(antiNodes.has(key)) {
                row += "#";
            } else {
                let found = false;
                for(const antennas of antennaMap.entries()) {
                    for(const [y2, x2] of antennas[1]) {
                        if(y === y2 && x === x2) {
                            row += antennas[0];
                            found = true;
                            break;
                        }
                    }
                    if(found) {
                        break;
                    }
                }
                if(!found) {
                    row += ".";
                }
            }
        }
        console.log(row);
    }
}