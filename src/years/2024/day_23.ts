export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const groups = new Set<string>();
    const nodes = buildGraph(input);

    for(const [nodeA, neighborsA] of nodes.entries()) {
        for(const nodeB of neighborsA) {
            for(const nodeC of nodes.get(nodeB)!) {
                const neighborsC = nodes.get(nodeC)!;
                if(neighborsC.has(nodeA)) {
                    const group = [nodeA, nodeB, nodeC].sort();
                    if(group.some(g => g[0]! === "t")) {
                        groups.add(group.join("-"));
                    }
                }
            }
        }
    }

    return groups.size
}

export function part_2(input: string[]): string {
    const nodes = buildGraph(input);

    const maximalClique = findLargestClique(nodes);

    return [...maximalClique].sort().join(",");
}

function buildGraph(relations: string[]) {
    const nodes = new Map<string, Set<string>>();
    for (const line of relations) {
        const [n1, n2] = line.split("-") as [string, string];
        if(!nodes.has(n1)) {
            nodes.set(n1, new Set());
        }
        nodes.get(n1)!.add(n2);
        
        if(!nodes.has(n2)) {
            nodes.set(n2, new Set());
        }
        nodes.get(n2)!.add(n1);
    }
    return nodes;
}

function findLargestClique(nodes: Map<string, Set<string>>) {
    let maximalClique = new Set<string>();

    // Clique problem solved with bron-kerbosch algorithm
    function bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>) {
        if(p.size === 0 && x.size === 0) {
            if(maximalClique.size < r.size) {
                maximalClique = r;
            }
            return;
        }

        for(const node of p) {
            const nodeNeighbors = nodes.get(node)!;
            bronKerbosch(new Set([...r, node]), p.intersection(nodeNeighbors), x.intersection(nodeNeighbors));
            p.delete(node);
            x.add(node);
        }
    }

    bronKerbosch(new Set(), new Set(nodes.keys()), new Set());

    return maximalClique;
}