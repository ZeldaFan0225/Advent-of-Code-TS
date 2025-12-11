export const INPUT_SPLIT = "\n";

function convertNodeNameToNumber(name: string): number {
    // from "aaa" to number 
    let nodeNum = name.split("").reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 'a'.charCodeAt(0)), 0);
    if(nodeNum === 16608) {
        // "you" node
        nodeNum = -1
    } else if(nodeNum == 10003) {
        // "out" node
        nodeNum = -2
    }
    return nodeNum;
}

function parseGraph(input: string[]): Map<number, number[]> {
    const outMap = new Map<number, number[]>();
    for(const line of input) {
        const [node, edgesRaw] = line.split(": ") as [string, string];
        let nodeNum = convertNodeNameToNumber(node);
        const edges = edgesRaw.split(" ").map(convertNodeNameToNumber);
        outMap.set(nodeNum, edges);
    }
    return outMap;
}

function countPaths(graph: Map<number, number[]>, currentNode: number, visited: Set<number>): number {
    if(currentNode === -2) {
        // reached "out" node
        return 1;
    }
    let pathCount = 0;
    const edges = graph.get(currentNode) || [];
    for(const neighbor of edges) {
        if(!visited.has(neighbor) || neighbor === -2) {
            visited.add(neighbor);
            pathCount += countPaths(graph, neighbor, visited);
            visited.delete(neighbor);
        }
    }
    return pathCount;
}

export function part_1(input: string[]): number {
    const graph = parseGraph(input);
    const paths = countPaths(graph, -1, new Set([-1]));
    return paths
}


export function part_2(input: string[]): number {
    return input.length
}