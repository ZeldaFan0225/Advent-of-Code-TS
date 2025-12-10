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

// Simple recursive search for minimum button presses
function solveIntegerSystemSimple(toggles: number[][], target: number[]): number | null {
    const numButtons = toggles.length;
    const numCounters = target.length;
    
    // Use rational Gaussian elimination to solve exactly
    // Represent rationals as [numerator, denominator]
    type Rational = [number, number];
    
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    
    const simplify = (r: Rational): Rational => {
        if (r[0] === 0) return [0, 1];
        const g = gcd(r[0], r[1]);
        const num = r[0] / g;
        const den = r[1] / g;
        return den < 0 ? [-num, -den] : [num, den];
    };
    
    const add = (a: Rational, b: Rational): Rational => 
        simplify([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
    
    const sub = (a: Rational, b: Rational): Rational => 
        simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
    
    const mul = (a: Rational, b: Rational): Rational => 
        simplify([a[0] * b[0], a[1] * b[1]]);
    
    const div = (a: Rational, b: Rational): Rational => 
        simplify([a[0] * b[1], a[1] * b[0]]);
    
    const isZero = (r: Rational): boolean => r[0] === 0;
    const toNumber = (r: Rational): number => r[0] / r[1];
    const fromNumber = (n: number): Rational => [n, 1];
    
    // Build augmented matrix [A | b] with rationals
    const matrix: Rational[][] = [];
    for (let i = 0; i < numCounters; i++) {
        const row: Rational[] = [];
        for (let j = 0; j < numButtons; j++) {
            row.push(fromNumber(toggles[j]![i]!));
        }
        row.push(fromNumber(target[i]!));
        matrix.push(row);
    }
    
    const numCols = numButtons;
    const numRows = numCounters;
    const pivotCol: number[] = Array(numRows).fill(-1);
    
    // Forward elimination
    let currentRow = 0;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
        // Find pivot
        let pivotRow = -1;
        for (let row = currentRow; row < numRows; row++) {
            if (!isZero(matrix[row]![col]!)) {
                pivotRow = row;
                break;
            }
        }
        if (pivotRow === -1) continue;
        
        // Swap
        [matrix[currentRow], matrix[pivotRow]] = [matrix[pivotRow]!, matrix[currentRow]!];
        pivotCol[currentRow] = col;
        
        const pivot = matrix[currentRow]![col]!;
        
        // Eliminate below
        for (let row = currentRow + 1; row < numRows; row++) {
            if (!isZero(matrix[row]![col]!)) {
                const factor = div(matrix[row]![col]!, pivot);
                for (let k = col; k <= numCols; k++) {
                    matrix[row]![k] = sub(matrix[row]![k]!, mul(factor, matrix[currentRow]![k]!));
                }
            }
        }
        currentRow++;
    }
    
    // Back substitution to RREF
    for (let row = currentRow - 1; row >= 0; row--) {
        const col = pivotCol[row]!;
        if (col === -1) continue;
        
        const pivot = matrix[row]![col]!;
        
        // Normalize pivot row
        for (let k = 0; k <= numCols; k++) {
            matrix[row]![k] = div(matrix[row]![k]!, pivot);
        }
        
        // Eliminate above
        for (let upperRow = row - 1; upperRow >= 0; upperRow--) {
            if (!isZero(matrix[upperRow]![col]!)) {
                const factor = matrix[upperRow]![col]!;
                for (let k = 0; k <= numCols; k++) {
                    matrix[upperRow]![k] = sub(matrix[upperRow]![k]!, mul(factor, matrix[row]![k]!));
                }
            }
        }
    }
    
    // Check for inconsistency
    for (let row = 0; row < numRows; row++) {
        let allZero = true;
        for (let col = 0; col < numCols; col++) {
            if (!isZero(matrix[row]![col]!)) {
                allZero = false;
                break;
            }
        }
        if (allZero && !isZero(matrix[row]![numCols]!)) {
            return null; // Inconsistent
        }
    }
    
    // Identify free columns
    const pivotCols = new Set(pivotCol.filter(c => c !== -1));
    const freeCols: number[] = [];
    for (let col = 0; col < numCols; col++) {
        if (!pivotCols.has(col)) {
            freeCols.push(col);
        }
    }
    
    // Build particular solution (free vars = 0)
    const particular: number[] = Array(numCols).fill(0);
    for (let row = 0; row < numRows; row++) {
        const col = pivotCol[row]!;
        if (col !== -1) {
            particular[col] = toNumber(matrix[row]![numCols]!);
        }
    }
    
    // Build null space basis (coefficients of free vars in pivot expressions)
    // For pivot var at col pCol in row r: x[pCol] = rhs - sum(matrix[r][freeCol] * x[freeCol])
    const nullBasis: number[][] = [];
    for (const freeCol of freeCols) {
        const basis: number[] = Array(numCols).fill(0);
        basis[freeCol] = 1;
        for (let row = 0; row < numRows; row++) {
            const pCol = pivotCol[row]!;
            if (pCol !== -1) {
                basis[pCol] = -toNumber(matrix[row]![freeCol]!);
            }
        }
        nullBasis.push(basis);
    }
    
    // Find minimum sum non-negative integer solution
    // Solution: x = particular + sum(t_i * nullBasis[i]) for integer t_i
    // We need x >= 0 and minimize sum(x)
    
    if (freeCols.length === 0) {
        // Unique solution - check if non-negative integers
        if (particular.every(v => v >= 0 && Number.isInteger(v))) {
            return particular.reduce((a, b) => a + b, 0);
        }
        return null;
    }
    
    // For efficiency, compute bounds on free variable multipliers
    // We need: particular[i] + sum(t_j * nullBasis[j][i]) >= 0 for all i
    // And: particular[i] + sum(t_j * nullBasis[j][i]) is integer
    
    let minSum = Infinity;
    const maxRange = Math.max(...target) + 50; // Search range for t values
    
    // Simple exhaustive search over reasonable bounds
    // For each t value, check if it leads to a valid non-negative integer solution
    const searchNullSpace = (depth: number, t: number[], current: number[]): void => {
        if (depth === freeCols.length) {
            // Check validity and compute sum
            let valid = true;
            for (let i = 0; i < numCols; i++) {
                const v = current[i]!;
                if (v < -1e-9 || Math.abs(v - Math.round(v)) > 1e-9) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                const rounded = current.map(v => Math.round(v));
                if (rounded.every(v => v >= 0)) {
                    const sum = rounded.reduce((a, b) => a + b, 0);
                    if (sum < minSum) {
                        minSum = sum;
                    }
                }
            }
            return;
        }
        
        // Search full range - t values can be negative or positive
        for (let tVal = -maxRange; tVal <= maxRange; tVal++) {
            t[depth] = tVal;
            const next = current.map((v, i) => v + tVal * nullBasis[depth]![i]!);
            
            // Early termination: if any component is way out of bounds, skip
            let dominated = false;
            for (let i = 0; i < numCols; i++) {
                if (next[i]! < -maxRange * freeCols.length || next[i]! > maxRange * 10) {
                    dominated = true;
                    break;
                }
            }
            if (!dominated) {
                searchNullSpace(depth + 1, t, next);
            }
        }
    };
    
    searchNullSpace(0, Array(freeCols.length).fill(0), [...particular]);
    
    return minSum === Infinity ? null : minSum;
}

// Debug version for null cases
function solveIntegerSystemDebug(toggles: number[][], target: number[]): void {
    const numButtons = toggles.length;
    const numCounters = target.length;
    
    console.log("  Buttons:", numButtons, "Counters:", numCounters);
    console.log("  Target:", target);
    
    // Same solver but with debug output
    type Rational = [number, number];
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const simplify = (r: Rational): Rational => {
        if (r[0] === 0) return [0, 1];
        const g = gcd(r[0], r[1]);
        const num = r[0] / g;
        const den = r[1] / g;
        return den < 0 ? [-num, -den] : [num, den];
    };
    const add = (a: Rational, b: Rational): Rational => simplify([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
    const sub = (a: Rational, b: Rational): Rational => simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
    const mul = (a: Rational, b: Rational): Rational => simplify([a[0] * b[0], a[1] * b[1]]);
    const div = (a: Rational, b: Rational): Rational => simplify([a[0] * b[1], a[1] * b[0]]);
    const isZero = (r: Rational): boolean => r[0] === 0;
    const toNumber = (r: Rational): number => r[0] / r[1];
    const fromNumber = (n: number): Rational => [n, 1];
    
    const matrix: Rational[][] = [];
    for (let i = 0; i < numCounters; i++) {
        const row: Rational[] = [];
        for (let j = 0; j < numButtons; j++) {
            row.push(fromNumber(toggles[j]![i]!));
        }
        row.push(fromNumber(target[i]!));
        matrix.push(row);
    }
    
    const numCols = numButtons;
    const numRows = numCounters;
    const pivotCol: number[] = Array(numRows).fill(-1);
    
    let currentRow = 0;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
        let pivotRow = -1;
        for (let row = currentRow; row < numRows; row++) {
            if (!isZero(matrix[row]![col]!)) {
                pivotRow = row;
                break;
            }
        }
        if (pivotRow === -1) continue;
        [matrix[currentRow], matrix[pivotRow]] = [matrix[pivotRow]!, matrix[currentRow]!];
        pivotCol[currentRow] = col;
        const pivot = matrix[currentRow]![col]!;
        for (let row = currentRow + 1; row < numRows; row++) {
            if (!isZero(matrix[row]![col]!)) {
                const factor = div(matrix[row]![col]!, pivot);
                for (let k = col; k <= numCols; k++) {
                    matrix[row]![k] = sub(matrix[row]![k]!, mul(factor, matrix[currentRow]![k]!));
                }
            }
        }
        currentRow++;
    }
    
    for (let row = currentRow - 1; row >= 0; row--) {
        const col = pivotCol[row]!;
        if (col === -1) continue;
        const pivot = matrix[row]![col]!;
        for (let k = 0; k <= numCols; k++) {
            matrix[row]![k] = div(matrix[row]![k]!, pivot);
        }
        for (let upperRow = row - 1; upperRow >= 0; upperRow--) {
            if (!isZero(matrix[upperRow]![col]!)) {
                const factor = matrix[upperRow]![col]!;
                for (let k = 0; k <= numCols; k++) {
                    matrix[upperRow]![k] = sub(matrix[upperRow]![k]!, mul(factor, matrix[row]![k]!));
                }
            }
        }
    }
    
    for (let row = 0; row < numRows; row++) {
        let allZero = true;
        for (let col = 0; col < numCols; col++) {
            if (!isZero(matrix[row]![col]!)) {
                allZero = false;
                break;
            }
        }
        if (allZero && !isZero(matrix[row]![numCols]!)) {
            console.log("  INCONSISTENT at row", row);
            return;
        }
    }
    
    const pivotCols = new Set(pivotCol.filter(c => c !== -1));
    const freeCols: number[] = [];
    for (let col = 0; col < numCols; col++) {
        if (!pivotCols.has(col)) freeCols.push(col);
    }
    
    const particular: number[] = Array(numCols).fill(0);
    for (let row = 0; row < numRows; row++) {
        const col = pivotCol[row]!;
        if (col !== -1) particular[col] = toNumber(matrix[row]![numCols]!);
    }
    
    console.log("  Pivot cols:", pivotCol);
    console.log("  Free cols:", freeCols);
    console.log("  Particular:", particular);
    
    // Also compute null basis for debugging
    const nullBasis: number[][] = [];
    for (const freeCol of freeCols) {
        const basis: number[] = Array(numCols).fill(0);
        basis[freeCol] = 1;
        for (let row = 0; row < numRows; row++) {
            const pCol = pivotCol[row]!;
            if (pCol !== -1) {
                basis[pCol] = -toNumber(matrix[row]![freeCol]!);
            }
        }
        nullBasis.push(basis);
    }
    console.log("  Null basis:", nullBasis);
}

// Integer Gaussian elimination for part 2
function solveIntegerSystem(toggles: number[][], target: number[], debug = false): number | null {
    const numCols = toggles.length;
    const numRows = target.length;
    
    // Build augmented matrix [A | b]
    const augmentedMatrix: number[][] = Array.from({ length: numRows }).map((_, i) => 
        [...Array.from({ length: numCols }).map((_, j) => toggles[j]![i]!), target[i]!]
    );
    
    if (debug) console.log("Initial matrix:", augmentedMatrix);
    
    // Track which column each row's pivot is in (-1 if no pivot)
    const pivotCol: number[] = Array(numRows).fill(-1);
    
    // Gaussian elimination over integers (using GCD-based reduction)
    let currentRow = 0;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
        // Find pivot row (non-zero entry with smallest absolute value)
        let pivotRow = -1;
        let minVal = Infinity;
        for (let row = currentRow; row < numRows; row++) {
            const val = Math.abs(augmentedMatrix[row]![col]!);
            if (val > 0 && val < minVal) {
                minVal = val;
                pivotRow = row;
            }
        }
        
        if (pivotRow === -1) continue; // Free variable
        
        // Swap rows if needed
        if (pivotRow !== currentRow) {
            [augmentedMatrix[currentRow], augmentedMatrix[pivotRow]] = 
            [augmentedMatrix[pivotRow]!, augmentedMatrix[currentRow]!];
        }
        
        // Make pivot positive
        if (augmentedMatrix[currentRow]![col]! < 0) {
            for (let k = 0; k <= numCols; k++) {
                augmentedMatrix[currentRow]![k] = -augmentedMatrix[currentRow]![k]!;
            }
        }
        
        pivotCol[currentRow] = col;
        const pivotVal = augmentedMatrix[currentRow]![col]!;
        
        // Eliminate below
        for (let row = currentRow + 1; row < numRows; row++) {
            const rowVal = augmentedMatrix[row]![col]!;
            if (rowVal !== 0) {
                const factor = Math.floor(rowVal / pivotVal);
                for (let k = col; k <= numCols; k++) {
                    augmentedMatrix[row]![k] = augmentedMatrix[row]![k]! - factor * augmentedMatrix[currentRow]![k]!;
                }
            }
        }
        
        // Check if we need to continue reducing this column
        let hasNonZero = false;
        for (let row = currentRow + 1; row < numRows; row++) {
            if (augmentedMatrix[row]![col] !== 0) {
                hasNonZero = true;
                break;
            }
        }
        if (hasNonZero) {
            col--; // Retry
        } else {
            currentRow++;
        }
    }
    
    // Back substitution
    for (let row = currentRow - 1; row >= 0; row--) {
        const col = pivotCol[row]!;
        if (col === -1) continue;
        
        const pivotVal = augmentedMatrix[row]![col]!;
        
        for (let upperRow = row - 1; upperRow >= 0; upperRow--) {
            const upperVal = augmentedMatrix[upperRow]![col]!;
            if (upperVal !== 0) {
                const factor = Math.floor(upperVal / pivotVal);
                for (let k = 0; k <= numCols; k++) {
                    augmentedMatrix[upperRow]![k] = augmentedMatrix[upperRow]![k]! - factor * augmentedMatrix[row]![k]!;
                }
            }
        }
    }
    
    // Identify free columns
    const pivotCols = new Set(pivotCol.filter(c => c !== -1));
    const freeCols: number[] = [];
    for (let col = 0; col < numCols; col++) {
        if (!pivotCols.has(col)) {
            freeCols.push(col);
        }
    }
    
    // Check for inconsistency
    for (let row = 0; row < numRows; row++) {
        const isZeroRow = augmentedMatrix[row]!.slice(0, numCols).every(v => v === 0);
        if (isZeroRow && augmentedMatrix[row]![numCols] !== 0) {
            if (debug) console.log("Inconsistent at row", row);
            return null;
        }
    }
    
    // Check divisibility and build particular solution
    const particular: number[] = Array(numCols).fill(0);
    for (let row = 0; row < numRows; row++) {
        const col = pivotCol[row]!;
        if (col !== -1) {
            const pivotVal = augmentedMatrix[row]![col]!;
            const rhs = augmentedMatrix[row]![numCols]!;
            if (rhs % pivotVal !== 0) {
                if (debug) console.log("Not divisible at row", row, "pivotVal", pivotVal, "rhs", rhs);
                return null;
            }
            particular[col] = rhs / pivotVal;
        }
    }
    
    if (debug) {
        console.log("Pivot cols:", pivotCol);
        console.log("Free cols:", freeCols);
        console.log("Particular solution:", particular);
        console.log("Augmented matrix after elimination:", augmentedMatrix);
    }
    
    // Build coefficient matrix for free variables (RAW values, not divided)
    const freeVarCoeffs: number[][] = [];
    for (let row = 0; row < numRows; row++) {
        const pCol = pivotCol[row]!;
        if (pCol !== -1) {
            const coeffs: number[] = [];
            for (const freeCol of freeCols) {
                coeffs.push(augmentedMatrix[row]![freeCol]!);
            }
            freeVarCoeffs.push(coeffs);
        }
    }
    
    if (debug) {
        console.log("Free var coeffs (raw):", freeVarCoeffs);
    }
    
    // Also store the pivot values for integrality checking
    const pivotVals: number[] = [];
    for (let row = 0; row < numRows; row++) {
        const pCol = pivotCol[row]!;
        if (pCol !== -1) {
            pivotVals.push(augmentedMatrix[row]![pCol]!);
        }
    }
    
    const pivotColToIdx: Map<number, number> = new Map();
    let idx = 0;
    for (let row = 0; row < numRows; row++) {
        if (pivotCol[row] !== -1) {
            pivotColToIdx.set(pivotCol[row]!, idx++);
        }
    }
    
    // Compute solution given free variable values
    // For each pivot row: pivotVal * x_pivot + sum(coeff_i * freeVal_i) = rhs
    // => x_pivot = (rhs - sum(coeff_i * freeVal_i)) / pivotVal
    const computeSolution = (freeVals: number[]): number[] | null => {
        const sol: number[] = Array(numCols).fill(0);
        
        // Set free variables
        for (let i = 0; i < freeCols.length; i++) {
            sol[freeCols[i]!] = freeVals[i]!;
        }
        
        // Compute pivot variables
        for (let row = 0; row < numRows; row++) {
            const pCol = pivotCol[row]!;
            if (pCol !== -1) {
                const rowIdx = pivotColToIdx.get(pCol)!;
                const pivotVal = pivotVals[rowIdx]!;
                const rhs = augmentedMatrix[row]![numCols]!;
                
                let freeContrib = 0;
                for (let i = 0; i < freeCols.length; i++) {
                    freeContrib += freeVarCoeffs[rowIdx]![i]! * freeVals[i]!;
                }
                
                const numerator = rhs - freeContrib;
                if (numerator % pivotVal !== 0) {
                    return null; // Not integer solution
                }
                sol[pCol] = numerator / pivotVal;
            }
        }
        
        if (sol.every(v => v >= 0)) {
            return sol;
        }
        return null;
    };
    
    // If no free variables
    if (freeCols.length === 0) {
        if (particular.every(v => v >= 0)) {
            return particular.reduce((a, b) => a + b, 0);
        }
        return null;
    }
    
    // Search for minimum with smarter bounds
    let minPresses = Infinity;
    
    // Compute bounds for single free variable case
    if (freeCols.length === 1) {
        let minFreeVal = 0;
        let maxFreeVal = Infinity;
        
        // For each pivot row: (rhs - coeff * freeVal) / pivotVal >= 0
        // Since we made pivotVal > 0: rhs - coeff * freeVal >= 0
        // => freeVal <= rhs/coeff (if coeff > 0)
        // => freeVal >= -rhs/-coeff (if coeff < 0)
        for (let row = 0; row < numRows; row++) {
            const pCol = pivotCol[row]!;
            if (pCol !== -1) {
                const rowIdx = pivotColToIdx.get(pCol)!;
                const coeff = freeVarCoeffs[rowIdx]![0]!;
                const rhs = augmentedMatrix[row]![numCols]!;
                
                // We need: rhs - coeff * freeVal >= 0
                if (coeff > 0) {
                    // freeVal <= rhs/coeff
                    maxFreeVal = Math.min(maxFreeVal, Math.floor(rhs / coeff));
                } else if (coeff < 0) {
                    // rhs - coeff * freeVal >= 0
                    // -coeff * freeVal >= -rhs
                    // freeVal >= rhs / coeff (coeff is negative, so divide flips)
                    // Actually: -coeff * freeVal >= -rhs => freeVal >= -rhs / -coeff = rhs / coeff
                    // But coeff < 0, so rhs/coeff < 0 if rhs > 0, which is always satisfied by freeVal >= 0
                    // Only constraining if rhs < 0: need freeVal >= rhs/coeff (which is positive)
                    if (rhs < 0) {
                        // -coeff * freeVal >= -rhs, -coeff > 0, -rhs > 0
                        // freeVal >= -rhs / -coeff
                        minFreeVal = Math.max(minFreeVal, Math.ceil(-rhs / -coeff));
                    }
                } else {
                    // coeff == 0, just need rhs >= 0
                    if (rhs < 0) {
                        return null; // No valid free value can fix this
                    }
                }
            }
        }
        
        if (maxFreeVal === Infinity) {
            maxFreeVal = Math.max(...target) * 2;
        }
        
        if (debug) {
            console.log("Free var bounds:", minFreeVal, maxFreeVal);
        }
        
        // If bounds are invalid, no solution
        if (minFreeVal > maxFreeVal) {
            if (debug) console.log("Invalid bounds");
            return null;
        }
        
        for (let freeVal = minFreeVal; freeVal <= maxFreeVal; freeVal++) {
            const sol = computeSolution([freeVal]);
            if (sol) {
                const total = sol.reduce((a, b) => a + b, 0);
                if (total < minPresses) {
                    minPresses = total;
                }
            }
        }
    } else {
        // Multiple free variables - need to search more carefully
        // Compute proper bounds considering negative particular values
        const maxVal = Math.max(...target) * 2;
        
        const search = (depth: number, freeVals: number[], currentSum: number): void => {
            // Prune if current sum already exceeds best
            if (currentSum >= minPresses) return;
            
            if (depth === freeCols.length) {
                const sol = computeSolution(freeVals);
                if (sol) {
                    const total = sol.reduce((a, b) => a + b, 0);
                    if (total < minPresses) {
                        minPresses = total;
                    }
                }
                return;
            }
            
            for (let val = 0; val <= maxVal; val++) {
                freeVals[depth] = val;
                search(depth + 1, freeVals, currentSum + val);
            }
        };
        
        search(0, Array(freeCols.length).fill(0), 0);
    }
    
    return minPresses === Infinity ? null : minPresses;
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
    let sum = 0;
    for(const line of input) {
        const machine = parseMachine(line);
        // For part 2, we need to reach the joltage levels (indicator lights are ignored)
        const sol = solveIntegerSystemSimple(machine.toggles, machine.joltageLevels);
        if (sol !== null) {
            sum += sol;
        }
    }
    return sum;
}

// 12302 too low
// 15000 too low