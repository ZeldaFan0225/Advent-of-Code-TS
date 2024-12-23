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

function orderVerticesByDegree(nodes: Map<string, Set<string>>): string[] {
    // Order vertices by degree (number of neighbors) 
    const degrees = new Map<string, number>();
    for (const [node, neighbors] of nodes) {
        degrees.set(node, neighbors.size);
    }
    return Array.from(nodes.keys()).sort((a, b) => degrees.get(b)! - degrees.get(a)!);
}

function findLargestClique(nodes: Map<string, Set<string>>) {
    let maximalClique = new Set<string>();
    const orderedVertices = orderVerticesByDegree(nodes);

    // Clique problem solved with bron-kerbosch algorithm with pivot
    function bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>) {
        if (p.size === 0 && x.size === 0) {
            if (maximalClique.size < r.size) {
                maximalClique = r;
            }
            return;
        }

        // Choose pivot vertex that maximizes |N(u) ∩ P|
        let pivot = null;
        let maxIntersection = -1;
        for (const u of new Set([...p, ...x])) {
            const intersection = p.intersection(nodes.get(u)!).size;
            if (intersection > maxIntersection) {
                maxIntersection = intersection;
                pivot = u;
            }
        }

        // Only process vertices not connected to pivot
        const verticesToProcess = pivot ? 
            p.difference(nodes.get(pivot)!) :
            p;

        for (const node of verticesToProcess) {
            const nodeNeighbors = nodes.get(node)!;
            bronKerbosch(
                new Set([...r, node]), 
                p.intersection(nodeNeighbors), 
                x.intersection(nodeNeighbors)
            );
            p.delete(node);
            x.add(node);
        }
    }

    // Start with ordered vertices
    const initialP = new Set(orderedVertices);
    bronKerbosch(new Set(), initialP, new Set());

    return maximalClique;
}
