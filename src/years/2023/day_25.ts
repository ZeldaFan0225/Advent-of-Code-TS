interface Node {
    name: string,
    children: Set<string>
}

interface MergedNode {
    names: Set<string>,
    children: Set<string>
}

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const nodes = parseNodes(input)
    return contractGraphKargersAlgorithm(nodes)
}


export function part_2(input: string[]): number {
    console.log("No Part 2")
    return -1
}

function parseNodes(input: string[]): Map<string, Node> {
    const map = new Map<string, Node>()
    const edges = new Set<string>()
    input.forEach((line, i) => {
        const [name, children] = line.split(": ") as [string, string]
        map.set(name, {name, children: new Set(children.split(" "))})
    })
    for(let node of map.values()) {
        for(let connection of node.children) {
            const child = map.get(connection)
            if(!child) {
                map.set(connection, {name: connection, children: new Set()})
            }
            map.get(connection)?.children.add(node.name)
        }
    }
    return map
}

function contractGraphKargersAlgorithm(input: Map<string, Node>) {
    let result: number | null = null
    while(result === null) {
        let nodes: MergedNode[] = [...input.values()].map(node => ({names: new Set([node.name]), children: node.children}))
        while(nodes.length > 2) {
            const node1 = getRandomElement(...nodes)
            const random_child = getRandomElement(...node1.children)
            const node2 = nodes.find(n => n.names.has(random_child))!
            nodes = nodes.filter(n => n !== node1 && n !== node2)

            const new_names = [...node1.names, ...node2.names]
            const new_node = {
                names: new Set(new_names),
                children: new Set([...node1.children, ...node2.children].filter(n => !new_names.includes(n)))
            }

            nodes.push(new_node)
        }
        if(nodes.at(0)?.children.size === 3 || nodes.at(1)?.children.size === 3) {
            result = nodes.at(0)!.names.size * nodes.at(1)!.names.size
        }
    }
    return result
}

function getNewName(node1: Node, node2: Node) {
    return `${node1.name}-${node2.name}`
}

function getRandomElement(...arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}