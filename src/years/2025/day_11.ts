export const INPUT_SPLIT = "\n";

// Predefined unique numbers for specific nodes
const you = 16608
const svr = 12731
const dac = 2030
const fft = 3529
const out = 10003

/**
 * Converts a node name (string of lowercase letters) to a unique number.
 * @param name name of the node
 * @returns unique number representing the node
 */
function convertNodeNameToNumber(name: string): number {
    return name.split("").reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 'a'.charCodeAt(0)), 0);
}

/**
 * Parses the input into a graph represented as an adjacency list.
 * @param input array of strings representing the graph edges
 * @returns adjacency list of the graph
 */
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

function countPaths(
    graph: Map<number, number[]>, 
    currentNode: number, 
    endNode: number, 
    forbidden: Set<number>,
    memo: Map<number, number> = new Map()
): number {
    if(currentNode === endNode) {
        return 1;
    }
    if(forbidden.has(currentNode)) {
        return 0;
    }
    if(memo.has(currentNode)) {
        return memo.get(currentNode)!;
    }
    
    let pathCount = 0;
    const edges = graph.get(currentNode) || [];
    for(const neighbor of edges) {
        pathCount += countPaths(graph, neighbor, endNode, forbidden, memo);
    }
    memo.set(currentNode, pathCount);
    return pathCount;
}

export function part_1(input: string[]): number {
    const graph = parseGraph(input);
    const paths = countPaths(graph, you, out, new Set());
    return paths
}

export function part_2(input: string[]): number {
    const graph = parseGraph(input);
    const svrToDac = countPaths(graph, svr, dac, new Set([fft, out]));
    const svrToFft = countPaths(graph, svr, fft, new Set([dac, out]));
    const dacToFft = countPaths(graph, dac, fft, new Set([svr, out]));
    const fftToDac = countPaths(graph, fft, dac, new Set([svr, out]));
    const dacToOut = countPaths(graph, dac, out, new Set([svr, fft]));
    const fftToOut = countPaths(graph, fft, out, new Set([svr, dac]));
    const paths = svrToDac * dacToFft * fftToOut + svrToFft * fftToDac * dacToOut
    return paths
}