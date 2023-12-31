enum NodeTypes {
    BROADCAST, CONJUNCTION, FLIP_FLOP
}

interface BroadcasterNode {
    name: string,
    type: NodeTypes.BROADCAST,
    triggers: string[]
}

interface FlipFlopNode extends Omit<BroadcasterNode, "type"> {
    type: NodeTypes.FLIP_FLOP,
    state: boolean
}

interface ConjunctionNode extends Omit<BroadcasterNode, "type"> {
    type: NodeTypes.CONJUNCTION
    parent_pulses: Record<string, boolean>
}

type Node = BroadcasterNode | FlipFlopNode | ConjunctionNode

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const nodes = parseNodes(input)
    return simulateCycles(nodes, false, 1000)
}


export function part_2(input: string[]): number {
    const nodes = parseNodes(input)
    let rxparent: Node | undefined
    nodes.forEach(n => {
        if(n.triggers.includes("rx")) rxparent = nodes.get(n.name)!
    })
    if(!rxparent || rxparent?.type !== NodeTypes.CONJUNCTION) throw new Error("No way to find out cycles")
    const cycles = countCycles(nodes, false, rxparent.name)
    return [...cycles.values()].reduce(lcm)
}


function gcd (a: number, b: number) {
    if(b === 0) return a;
    return gcd(b, a%b);
}

function lcm (a: number, b: number) {
    return Math.abs(a * b) / gcd(a, b)
}

function parseNodes(input: string[]) {
    const nodes: Map<string, Node> = new Map()
    for (let line of input) {
        const [info, triggers] = line.split(" -> ")
        if(!info || !triggers) continue;
        const trigger = triggers!.split(", ")
        const type = info === "broadcaster" ? NodeTypes.BROADCAST : info?.startsWith("&") ? NodeTypes.CONJUNCTION : NodeTypes.FLIP_FLOP
        const name = info?.replace("&", "").replace("%", "")!
        switch(type) {
            case NodeTypes.BROADCAST: {
                nodes.set(name, {name, type, triggers: trigger})
                break;
            }
            case NodeTypes.CONJUNCTION: {
                nodes.set(name, {name, type, triggers: trigger, parent_pulses: {}})
                break;
            }
            case NodeTypes.FLIP_FLOP: {
                nodes.set(name, {name, type, triggers: trigger, state: false})
                break;
            }
        }
    }
    for (let [name, node] of nodes) {
        const children = node.triggers
        for(let child of children) {
            const c = nodes.get(child)
            if(!c) continue;
            if(c.type === NodeTypes.CONJUNCTION) {
                c.parent_pulses[name] = false
            }
        }
    }

    return nodes
}

function simulateCycles(nodes: Map<string, Node>, initial_pulse: boolean, cycles = 1000) {
    let low_count = 0
    let high_count = 0

    for(let i = 0; i < cycles; i++) {
        const queue = [{name: "broadcaster", pulse_type: initial_pulse, coming_from: "button"}]
        while(queue.length) {
            const elements = queue.splice(0)
            for(let temp of elements) {
                const {name, pulse_type, coming_from} = temp
                const node = nodes.get(name)

                console.log(`${coming_from} - ${pulse_type ? "high" : "low"} -> ${name}`)
                if(pulse_type) high_count++
                else low_count++

                switch(node?.type) {
                    case NodeTypes.BROADCAST: {
                        queue.push(...node.triggers.map(name => ({name, pulse_type, coming_from: node.name})))
                        break;
                    }
                    case NodeTypes.CONJUNCTION: {
                        node.parent_pulses[coming_from] = pulse_type
                        const output = !Object.values(node.parent_pulses).every(n => n)
                        queue.push(...node.triggers.map(name => ({name, pulse_type: output, coming_from: node.name})))
                        break;
                    }
                    case NodeTypes.FLIP_FLOP: {
                        if(pulse_type) break;
                        node.state = !node.state
                        queue.push(...node.triggers.map(name => ({name, pulse_type: node.state, coming_from: node.name})))
                        break;
                    }
                }
            }
        }
    }
    return high_count * low_count
}


function countCycles(nodes: Map<string, Node>, initial_pulse: boolean, high_node: string) {
    let count = 0
    let found = false

    const cycles = new Map<string, number>()

    while(!found) {
        const queue = [{name: "broadcaster", pulse_type: initial_pulse, coming_from: "button"}]
        count++
        while(queue.length) {
            const elements = queue.splice(0)
            for(let temp of elements) {
                const {name, pulse_type, coming_from} = temp
                const node = nodes.get(name)

                switch(node?.type) {
                    case NodeTypes.BROADCAST: {
                        queue.push(...node.triggers.map(name => ({name, pulse_type, coming_from: node.name})))
                        break;
                    }
                    case NodeTypes.CONJUNCTION: {
                        node.parent_pulses[coming_from] = pulse_type
                        const output = !Object.values(node.parent_pulses).every(n => n)
                        if(high_node === name) {
                            if(pulse_type && !cycles.has(coming_from)) cycles.set(coming_from, count)
                            if(Object.keys(node.parent_pulses).every(k => cycles.has(k))) found = true
                        }
                        queue.push(...node.triggers.map(name => ({name, pulse_type: output, coming_from: node.name})))
                        break;
                    }
                    case NodeTypes.FLIP_FLOP: {
                        if(pulse_type) break;
                        node.state = !node.state
                        queue.push(...node.triggers.map(name => ({name, pulse_type: node.state, coming_from: node.name})))
                        break;
                    }
                }
            }
        }
    }

    return cycles
}