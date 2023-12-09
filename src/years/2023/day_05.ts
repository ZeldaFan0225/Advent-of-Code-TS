export function part_1(input: string): number {
    const lines = input.split("\n\n")

    const seeds_string = lines.splice(0, 1)[0]
    const categories: {source_start: number, source_end: number, diff: number}[][] = []
    const seeds = seeds_string!.split(" ").slice(1).map(n => parseInt(n))

    for(let category of lines) {
        const category_lines = category.split("\n").slice(1)
        categories.push([])

        category_lines.forEach(c => {
            const [destination, source, range] = c.split(" ").map(n => parseInt(n))
            categories.at(-1)!.push({
                source_start: source!,
                source_end: source! + (range! - 1),
                diff: destination! - source!
            })
        })
    }

    for(let category of categories) {
        for(let i in seeds) {
            for(let map of category) {
                if(seeds[i]! >= map.source_start && seeds[i]! <= map.source_end) {
                    seeds[i] += map.diff
                    break;
                }
            }
        }
    }

    return seeds.sort((a, b) => a - b)[0]!
}


export function part_2(input: string): number {
    const lines = input.split("\n\n")

    const seeds_string = lines.splice(0, 1)[0]
    const categories: {source_start: number, source_end: number, diff: number}[][] = []
    const seed_pairs = seeds_string!.split(" ").slice(1).map(n => parseInt(n))
    const seeds: {range_start: number, range_end: number}[] = []
    for(let i = 0; i < seed_pairs.length; i += 2) {
        seeds.push({
            range_start: seed_pairs[i]!,
            range_end: seed_pairs[i]! + (seed_pairs[i + 1]! - 1),
        })
    }

    for(let category of lines) {
        const category_lines = category.split("\n").slice(1)
        categories.push([])

        category_lines.forEach(c => {
            const [destination, source, range] = c.split(" ").map(n => parseInt(n))
            categories.at(-1)!.push({
                source_start: source!,
                source_end: source! + (range! - 1),
                diff: destination! - source!
            })
        })
    }

    for(let category of categories) {
        let i = 0
        const to_push= []
        while(seeds[i]) {
            for(let map of category) {
                // if overlapping exists
                if(seeds[i]!.range_end >= map.source_start || seeds[i]!.range_start <= map.source_end) {
                    // if fully inside map range
                    if(seeds[i]!.range_start >= map.source_start && seeds[i]!.range_end <= map.source_end) {
                        seeds[i] = {
                            range_start: seeds[i]!.range_start + map.diff,
                            range_end: seeds[i]!.range_end + map.diff,
                        }
                        break;
                        // if only the end is overlapping
                    } else if(seeds[i]!.range_end >= map.source_start && seeds[i]!.range_start < map.source_start) {
                        to_push.push({
                            range_start: map.source_start + map.diff,
                            range_end: seeds[i]!.range_end + map.diff,
                        })
                        seeds[i] = {
                            range_start: seeds[i]!.range_start,
                            range_end: map.source_start - 1,
                        }
                        break;
                        // if only the start is overlapping
                    } else if(seeds[i]!.range_start <= map.source_end && seeds[i]!.range_end > map.source_end) {
                        to_push.push({
                            range_start: seeds[i]!.range_start + map.diff,
                            range_end: map.source_end + map.diff,
                        })
                        seeds[i] = {
                            range_start: map.source_end + 1,
                            range_end: seeds[i]!.range_end,
                        }
                        break;
                    }
                }
            }
            i += 1;
        }
        seeds.push(...to_push)
    }

    return seeds.sort((a, b) => a.range_start - b.range_start)[0]!.range_start!
}