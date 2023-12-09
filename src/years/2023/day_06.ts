export function part_1(input: string): number {
    const lines = input.split("\n")
    const number_regex = /\d+/g

    const times = []
    const distances = []
    const tolerances = []

    let match;
    while((match = number_regex.exec(lines[0]!)) != null) {
        times.push(parseInt(match[0]))
    }
    while((match = number_regex.exec(lines[1]!)) != null) {
        distances.push(parseInt(match[0]))
    }

    for(let i in times) {
        const ends = getEnds(times[i]!, distances[i]!)
        const diff = ends.upper - ends.lower + 1

        tolerances.push(diff)
    }

    function getEnds(time: number, distance: number) {
        const fraction = time / 2;
        const t1 = fraction - Math.sqrt(fraction**2 - (distance + 1))
        const t2 = fraction + Math.sqrt(fraction**2 - (distance + 1))

        return {
            lower: Math.ceil(t1),
            upper: Math.floor(t2)
        }
    }

    return tolerances.reduce((a, b) => a * b)
}


export function part_2(input: string): number {
    const lines = input.split("\n")

    const time = parseInt(/\d+/g.exec(lines[0]!.replaceAll(" ", ""))![0]!)
    const distance = parseInt(/\d+/g.exec(lines[1]!.replaceAll(" ", ""))![0]!)

    const ends = getEnds(time, distance)
    const tolerance = ends.upper - ends.lower + 1

    function getEnds(time: number, distance: number) {
        const fraction = time / 2;
        const t1 = fraction - Math.sqrt(fraction**2 - (distance + 1))
        const t2 = fraction + Math.sqrt(fraction**2 - (distance + 1))

        return {
            lower: Math.ceil(t1),
            upper: Math.floor(t2)
        }
    }

    return tolerance
}