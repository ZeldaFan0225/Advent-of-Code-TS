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

interface ConjunktionNode extends Omit<BroadcasterNode, "type"> {
    type: NodeTypes.CONJUNCTION
    parent_pulses: Record<string, boolean>
}

type Node = BroadcasterNode | FlipFlopNode | ConjunktionNode

interface QueuedNode {
    pulse_type: boolean,
    coming_from: string,
    name: string
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const nodes = parseNodes(input)
    return simulateCycles(nodes, false, 1000)
}


export function part_2(input: string[]): number {
    const nodes = parseNodes(input)
    return countCycles(nodes, false)
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


function countCycles(nodes: Map<string, Node>, initial_pulse: boolean) {
    let low_count = 0
    let high_count = 0
    let count = 0
    let found = false

    while(!found) {
        const queue = [{name: "broadcaster", pulse_type: initial_pulse, coming_from: "button"}]
        while(queue.length) {
            const elements = queue.splice(0)
            for(let temp of elements) {
                const {name, pulse_type, coming_from} = temp
                const node = nodes.get(name)

                if(name === "rx" && !pulse_type) console.log("rx", !pulse_type)
                if(name === "rx" && !pulse_type) found = true

                console.log(`${coming_from} - ${pulse_type ? "high" : "low"} -> ${name}`)

                if(pulse_type) high_count++
                else low_count++

                //console.log(`- ${pulse_type ? "high" : "low"} -> ${name}`)
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
        count++
    }
    return count
}