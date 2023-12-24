/*
=========================
Interfaces and Types
=========================
 */

type Dimension = "x" | "y" | "z"
type Vector = Record<Dimension, number>

interface Line {
    support: Vector,
    direction: Vector
}


export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const lines = parseLines(input)
    return checkLines(lines, 200000000000000, 400000000000000)
}


export function part_2(input: string): number {
return input.length
}


/*
=========================
Utility functions
=========================
 */

function parseLines(input: string[]) {
    const lines: Line[] = []
    for(let line of input) {
        const {px, py, pz, vx, vy, vz} = /(?<px>-?\d+),  ?(?<py>-?\d+),  ?(?<pz>-?\d+) @  ?(?<vx>-?\d+),  ?(?<vy>-?\d+),  ?(?<vz>-?\d+)/.exec(line)?.groups!
        if(!px || !py || !pz || !vx || !vy || !vz) throw new Error("Invalid line")
        lines.push({
            support: {x: parseInt(px), y: parseInt(py), z: parseInt(pz)},
            direction: {x: parseInt(vx), y: parseInt(vy), z: parseInt(vz)}
        })
    }
    return lines
}

/*
=========================
Part 1 specific functions
=========================
 */

function checkLines(lines: Line[], min: number, max: number) {
    const checked = new Map<string, boolean>
    for(let i = 0; i < lines.length; i++) {
        for(let j = i + 1; j < lines.length; j++) {
            const checkHash = getCheckHash(i, j)
            if(checked.has(checkHash)) continue;
            checked.set(checkHash, checkIfIntersect(lines[i]!, lines[j]!, min, max))
        }
    }

    return [...checked.values()].map(n => n ? 1 : 0).reduce((a: number, b: number) => a + b, 0)
}

function getCheckHash(i1: number, i2: number) {
    return `${Math.min(i1, i2)}-${Math.max(i1, i2)}`
}

function checkIfIntersect(line1: Line, line2: Line, min: number, max: number): boolean {
    const {line1_time, line2_time} = getTimesXY(line1, line2)
    // if times are negative
    if(line1_time < 0 || line2_time < 0) return false;

    const intersection_point = getPoint(line1, line1_time)

    return ["x" as "x", "y" as "y"].every(d => intersection_point[d] >= min && intersection_point[d] <= max)
}

function getTimesXY(line1: Line, line2: Line) {
    const s = (((line1.direction.y * line2.support.x) - (line1.direction.y * line1.support.x)) / ((line2.direction.y * line1.direction.x) - (line1.direction.y * line2.direction.x))) + ((line1.support.y - line2.support.y) / (line2.direction.y - ((line1.direction.y * line2.direction.x) / line1.direction.x)))
    const r = (line2.support.x - line1.support.x + (s * line2.direction.x)) / line1.direction.x

    return {line1_time: r, line2_time: s}
}

function getPoint(line: Line, time: number): Vector {
    return {
        x: line.support.x + line.direction.x * time,
        y: line.support.y + line.direction.y * time,
        z: line.support.z + line.direction.z * time,
    }
}


/*
=========================
Part 2 specific functions
=========================
 */