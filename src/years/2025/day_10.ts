export const INPUT_SPLIT = "\n";
interface Machine {
    indicatorLights: number[];
    toggles: number[][];
    joltageLevels: number[];
}
function parseMachine(input: string): Machine {
    const raw = input.split(" ") as string[];
    const [indicatorLightsRaw, togglesRaw, joltageLevelsRaw] = [raw[0], raw.slice(1, raw.length - 1), raw[raw.length - 1]] as [string, string[], string];
    const indicatorLights = indicatorLightsRaw?.substring(1, indicatorLightsRaw.length -1).split("").map(n => n === "#" ? 1 : 0) as number[];
    const toggles: number[][] = [];
    for(const toggle of togglesRaw) {
        const indexes = toggle.slice(1, -1).split(",").map(n => +n);
        const vector = Array.from({ length: indicatorLights.length }).map((_, i) => indexes.includes(i) ? 1 : 0);
        toggles.push(vector);
    }
    const joltageLevels = joltageLevelsRaw?.slice(1, -1).split(",").map(n => +n) as number[];
    return {
        indicatorLights,
        toggles,
        joltageLevels
    }
}

function generateZSF(toggles: number[][], output: number[]) {
    const numCols = toggles.length;
    const numRows = output.length;
    
    // Build augmented matrix [A | b] where A is the toggle matrix and b is the output
    const augmentedMatrix: number[][] = Array.from({ length: numRows }).map((_, i) => 
        [...Array.from({ length: numCols }).map((_, j) => toggles[j]![i]!), output[i]!]
    );
    
    // Track which column each row's pivot is in (-1 if no pivot)
    const pivotCol: number[] = Array(numRows).fill(-1);
    
    // Gaussian elimination to row echelon form
    let currentRow = 0;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
        // Find pivot row
        let pivotRow = -1;
        for (let row = currentRow; row < numRows; row++) {
            if (augmentedMatrix[row]![col] === 1) {
                pivotRow = row;
                break;
            }
        }
        
        if (pivotRow === -1) continue; // No pivot in this column, it's a free variable
        
        // Swap rows if needed
        if (pivotRow !== currentRow) {
            [augmentedMatrix[currentRow], augmentedMatrix[pivotRow]] = 
            [augmentedMatrix[pivotRow]!, augmentedMatrix[currentRow]!];
        }
        
        pivotCol[currentRow] = col;
        
        // Eliminate below
        for (let row = currentRow + 1; row < numRows; row++) {
            if (augmentedMatrix[row]![col] === 1) {
                for (let k = col; k <= numCols; k++) {
                    augmentedMatrix[row]![k]! ^= augmentedMatrix[currentRow]![k]!;
                }
            }
        }
        currentRow++;
    }
    
    // Back substitution to reduced row echelon form
    for (let row = currentRow - 1; row >= 0; row--) {
        const col = pivotCol[row]!;
        if (col === -1) continue;
        
        for (let upperRow = row - 1; upperRow >= 0; upperRow--) {
            if (augmentedMatrix[upperRow]![col] === 1) {
                for (let k = col; k <= numCols; k++) {
                    augmentedMatrix[upperRow]![k]! ^= augmentedMatrix[row]![k]!;
                }
            }
        }
    }
    
    // Identify pivot columns and free columns
    const pivotCols = new Set(pivotCol.filter(c => c !== -1));
    const freeCols: number[] = [];
    for (let col = 0; col < numCols; col++) {
        if (!pivotCols.has(col)) {
            freeCols.push(col);
        }
    }
    
    // Check for inconsistency (row of form [0 0 ... 0 | 1])
    for (let row = 0; row < numRows; row++) {
        const isZeroRow = augmentedMatrix[row]!.slice(0, numCols).every(v => v === 0);
        if (isZeroRow && augmentedMatrix[row]![numCols] === 1) {
            throw new Error("No solution exists (inconsistent system)");
        }
    }
    
    // Build particular solution (set free variables to 0)
    const partikulaererLoesungsvektor: number[] = Array(numCols).fill(0);
    for (let row = 0; row < numRows; row++) {
        const col = pivotCol[row]!;
        if (col !== -1) {
            partikulaererLoesungsvektor[col] = augmentedMatrix[row]![numCols]!;
        }
    }
    
    // Build null space basis vectors (linearer Aufspann)
    const linearerAufspannVektoren: number[][] = [];
    for (const freeCol of freeCols) {
        const basisVector: number[] = Array(numCols).fill(0);
        basisVector[freeCol] = 1; // Set free variable to 1
        
        // For each pivot row, compute the value needed to satisfy the homogeneous system
        for (let row = 0; row < numRows; row++) {
            const pCol = pivotCol[row]!;
            if (pCol !== -1) {
                // The pivot variable equals the sum of (coefficient * free variable value) for free vars
                basisVector[pCol] = augmentedMatrix[row]![freeCol]!;
            }
        }
        linearerAufspannVektoren.push(basisVector);
    }

    // Find all possible combinations
    let minAmountOfToggles = Infinity;
    for(const combination of Array.from({ length : 1 << freeCols.length }).map((_, i) => i)) {
        const solutionVector = [...partikulaererLoesungsvektor];
        for(let i = 0; i < freeCols.length; i++) {
            if((combination & (1 << i)) !== 0) {
                const freeCol = freeCols[i]!;
                for (let row = 0; row < numRows; row++) {
                    const pCol = pivotCol[row]!;
                    if (pCol !== -1) {
                        solutionVector[pCol]! ^= augmentedMatrix[row]![freeCol]!;
                    }
                }
                solutionVector[freeCol] = 1;
            }
        }
        const oneCount = solutionVector.reduce((acc, val) => acc + val, 0);
        if(oneCount < minAmountOfToggles) {
            minAmountOfToggles = oneCount;
        }
    }
    
    return minAmountOfToggles;
}
export function part_1(input: string[]): number {
    let sum = 0;
    for(const line of input) {
        const machine = parseMachine(line);
        const sol = generateZSF(machine.toggles, machine.indicatorLights);
        sum += sol;
    }
    return sum;
}


export function part_2(input: string[]): number {
    return input.length
}