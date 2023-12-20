enum NodeTypes {
    BROADCAST, CONJUNCTION, FLIP_FLOP
}

interface Node {
    name: string,
    type: NodeTypes,
    trigger: string[]
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    console.log(parseNodes(input))
    return input.length
}


export function part_2(input: string): number {
return input.length
}

function parseNodes(input: string[]) {
    const nodes: Map<string, Node> = new Map()
    for (let line of input) {
        const [info, triggers] = line.split(" -> ")
        if(!info || !triggers) continue;
        const trigger = triggers!.split(", ")
        const type = info === "broadcaster" ? NodeTypes.BROADCAST : info?.startsWith("&") ? NodeTypes.CONJUNCTION : NodeTypes.FLIP_FLOP
        const name = info?.replace("&", "").replace("%", "")
        nodes.set(name!, {name: name!, type, trigger})
    }
    return nodes
}