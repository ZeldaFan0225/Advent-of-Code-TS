export function part_1(input: string): number {
    const [instruction, nodes_text] = input.split("\n\n")
    const nodes_lines = nodes_text!.split("\n")
    const nodes_regex = /^\(([A-Z]{3}), ([A-Z]{3})\)$/

    const instructions = instruction!.split("").map(i => i === "L" ? 0 : 1)
    const nodes: Record<string, string[]> = {}
    let curr_node = "AAA"

    nodes_lines.forEach(l => {
        const [name, children] = l.split(" = ")
        let match = nodes_regex.exec(children!);

        nodes[name!] = match!.slice(1, 3)
    })

    let i = 0;
    while(curr_node !== "ZZZ") {
        curr_node = nodes[curr_node]![instructions[i % instructions.length]!]!
        i++
    }

    return i
}


export function part_2(input: string): number {
    const [instruction, nodes_text] = input.split("\n\n")
    const nodes_lines = nodes_text!.split("\n")
    const nodes_regex = /^\(([A-Z0-9]{3}), ([A-Z0-9]{3})\)$/

    const instructions = instruction!.split("").map(i => i === "L" ? 0 : 1)
    const nodes: Record<string, string[]> = {}
    let curr_nodes = []

    nodes_lines.forEach(l => {
        const [name, children] = l.split(" = ")
        let match = nodes_regex.exec(children!);

        nodes[name!] = match!.slice(1, 3)
    })

    for(let node of Object.keys(nodes)) {
        if(node.endsWith(("A"))) curr_nodes.push(node)
    }

    const lengths = []

    for(let node of curr_nodes) {
        lengths.push(chainLength(node))
    }

    function chainLength(start: string) {
        let ind = 0;
        let current_node = start;
        while(!current_node.endsWith("Z")) {
            current_node = nodes[current_node]![instructions[ind % instructions.length]!]!
            ind++
        }

        return ind;
    }

    function gcd (a: number, b: number) {
        if(b === 0) return a;
        return gcd(b, a%b);
    }

    function lcm (a: number, b: number) {
        return Math.abs(a * b) / gcd(a, b)
    }

    return lengths.reduce(lcm)
}