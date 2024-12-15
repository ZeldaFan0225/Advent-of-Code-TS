import { appendFile, appendFileSync } from "fs";

export const INPUT_SPLIT = "\n";

const GRIDWIDTH = 101
const GRIDHEIGHT = 103

const quadrantLeftThreshold = Math.floor(GRIDWIDTH / 2) - 1
const quadrantRightThreshold = Math.ceil(GRIDWIDTH / 2)
const quadrantTopThreshold = Math.floor(GRIDHEIGHT / 2) - 1
const quadrantBottomThreshold = Math.ceil(GRIDHEIGHT / 2)

class Robot {
    #pos: [number, number]
    #vel: [number, number]
    constructor(raw: string) {
        const [pos, vel] = raw.slice(2).split(" v=") as [string, string]
        const [posX, posY] = pos.split(",").map(Number) as [number, number]
        const [velX, velY] = vel.split(",").map(Number) as [number, number]

        this.#pos = [posX, posY]
        this.#vel = [velX, velY]
    }

    #correctModulo(n: number, m: number): number {
        return ((n % m) + m) % m
    }

    xAtSeconds(seconds: number): number {
        return this.#correctModulo(this.#pos[0] + this.#vel[0] * seconds, GRIDWIDTH)
    }

    yAtSeconds(seconds: number): number {
        return this.#correctModulo(this.#pos[1] + this.#vel[1] * seconds, GRIDHEIGHT)
    }
}

export function part_1(input: string[], visualize?: boolean): number {
    let quadrants: [number, number, number, number] = [0, 0, 0, 0]
    let robots: Robot[] = []
    for (const line of input) {
        const robot = new Robot(line)
        const x = robot.xAtSeconds(100)
        const y = robot.yAtSeconds(100)
        if(x <= quadrantLeftThreshold && y <= quadrantTopThreshold) {
            quadrants[0]++
        } else if(x >= quadrantRightThreshold && y <= quadrantTopThreshold) {
            quadrants[1]++
        } else if(x <= quadrantLeftThreshold && y >= quadrantBottomThreshold) {
            quadrants[2]++
        } else if(x >= quadrantRightThreshold && y >= quadrantBottomThreshold) {
            quadrants[3]++
        }
        robots.push(robot)
    }
    if(visualize) printRobotPositions(robots, 100)
    return quadrants.reduce((acc, val) => acc * val)
}

// I hate this
export function part_2(input: string[], visualize?: boolean): number {
    let seconds = 0
    while(true) {
        let robots: Robot[] = []
        for (const line of input) {
            robots.push(new Robot(line))
        }
        const visual = generateRobotsGrid(robots, seconds++)
        // find the frame of the tree
        if(visual.find(r => r.includes("#".repeat(20)))) {
            if(visualize) printRobotPositions(robots, seconds-1)
            break;
        }
    }
    return seconds - 1
}

function printRobotPositions(robots: Robot[], seconds: number) {
    const grid = Array.from({ length: GRIDHEIGHT }, () => Array.from({ length: GRIDWIDTH }, () => "."))
    for (const robot of robots) {
        const x = robot.xAtSeconds(seconds)
        const y = robot.yAtSeconds(seconds)
        grid[y]![x] = grid[y]![x] === "." ? "1" : `${Number(grid[y]![x]!) + 1}`
    }
    for (const row of grid) {
        console.log(row.join(""))
    }
}

function generateRobotsGrid(robots: Robot[], seconds: number): string[] {
    // Generate grid from robots and put it in an array of the rows
    const grid = Array.from({ length: GRIDHEIGHT }, () => Array.from({ length: GRIDWIDTH }, () => "."))
    for (const robot of robots) {
        const x = robot.xAtSeconds(seconds)
        const y = robot.yAtSeconds(seconds)
        grid[y]![x] = "#"
    }
    return grid.map(row => row.join(""))
}