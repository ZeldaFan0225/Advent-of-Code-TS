export const INPUT_SPLIT = "\n";

interface Machine {
    indicatorLights: number[];
    toggles: number[][];
    joltageLevels: number[];
}

function parseMachine(input: string): Machine {
    const raw = input.split(" ");
    const indicatorLightsRaw = raw[0]!;
    const togglesRaw = raw.slice(1, -1);
    const joltageLevelsRaw = raw[raw.length - 1]!;
    
    const indicatorLights = indicatorLightsRaw.slice(1, -1).split("").map(n => n === "#" ? 1 : 0);
    const toggles = togglesRaw.map(toggle => {
        const indexes = toggle.slice(1, -1).split(",").map(Number);
        return indicatorLights.map((_, i) => indexes.includes(i) ? 1 : 0);
    });
    const joltageLevels = joltageLevelsRaw.slice(1, -1).split(",").map(Number);
    
    return { indicatorLights, toggles, joltageLevels };
}

// Part 1: GF(2) Gaussian elimination for toggle problem (each button 0 or 1 times)
function solveGF2(toggles: number[][], target: number[]): number {
    const numCols = toggles.length;
    const numRows = target.length;
    
    // Build augmented matrix [A | b]
    const matrix = target.map((t, i) => [...toggles.map(col => col[i]!), t]);
    const pivotCol: number[] = Array(numRows).fill(-1);
    
    // Forward elimination
    let currentRow = 0;
    for (let col = 0; col < numCols && currentRow < numRows; col++) {
        const pivotRow = matrix.slice(currentRow).findIndex(row => row[col] === 1);
        if (pivotRow === -1) continue;
        
        [matrix[currentRow], matrix[currentRow + pivotRow]] = [matrix[currentRow + pivotRow]!, matrix[currentRow]!];
        pivotCol[currentRow] = col;
        
        for (let row = currentRow + 1; row < numRows; row++) {
            if (matrix[row]![col] === 1) {
                for (let k = col; k <= numCols; k++) matrix[row]![k]! ^= matrix[currentRow]![k]!;
            }
        }
        currentRow++;
    }
    
    // Back substitution
    for (let row = currentRow - 1; row >= 0; row--) {
        const col = pivotCol[row]!;
        if (col === -1) continue;
        for (let upperRow = 0; upperRow < row; upperRow++) {
            if (matrix[upperRow]![col] === 1) {
                for (let k = col; k <= numCols; k++) matrix[upperRow]![k]! ^= matrix[row]![k]!;
            }
        }
    }
    
    // Find free columns and enumerate all 2^k combinations
    const pivotCols = new Set(pivotCol.filter(c => c !== -1));
    const freeCols = Array.from({ length: numCols }, (_, i) => i).filter(c => !pivotCols.has(c));
    
    let minToggles = Infinity;
    for (let combo = 0; combo < (1 << freeCols.length); combo++) {
        const solution = Array(numCols).fill(0);
        for (let row = 0; row < numRows; row++) {
            if (pivotCol[row] !== -1) solution[pivotCol[row]!] = matrix[row]![numCols]!;
        }
        for (let i = 0; i < freeCols.length; i++) {
            if (combo & (1 << i)) {
                solution[freeCols[i]!] = 1;
                for (let row = 0; row < numRows; row++) {
                    if (pivotCol[row] !== -1) solution[pivotCol[row]!] ^= matrix[row]![freeCols[i]!]!;
                }
            }
        }
        minToggles = Math.min(minToggles, solution.reduce((a, b) => a + b, 0));
    }
    
    return minToggles;
}

// Part 2: Rational Gaussian elimination for integer linear system
function solveIntegerSystem(toggles: number[][], target: number[]): number | null {
    const numButtons = toggles.length;
    const numCounters = target.length;
    
    // Rational arithmetic helpers
    type Rat = [number, number];
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const simplify = ([n, d]: Rat): Rat => {
        if (n === 0) return [0, 1];
        const g = gcd(n, d);
        return d < 0 ? [-n / g, -d / g] : [n / g, d / g];
    };
    const sub = (a: Rat, b: Rat): Rat => simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
    const mul = (a: Rat, b: Rat): Rat => simplify([a[0] * b[0], a[1] * b[1]]);
    const div = (a: Rat, b: Rat): Rat => simplify([a[0] * b[1], a[1] * b[0]]);
    const isZero = (r: Rat) => r[0] === 0;
    const toNum = (r: Rat) => r[0] / r[1];
    const rat = (n: number): Rat => [n, 1];
    
    // Build augmented matrix
    const matrix: Rat[][] = target.map((t, i) => [...toggles.map(col => rat(col[i]!)), rat(t)]);
    const pivotCol: number[] = Array(numCounters).fill(-1);
    
    // Forward elimination
    let currentRow = 0;
    for (let col = 0; col < numButtons && currentRow < numCounters; col++) {
        const pivotRow = matrix.slice(currentRow).findIndex(row => !isZero(row[col]!));
        if (pivotRow === -1) continue;
        
        [matrix[currentRow], matrix[currentRow + pivotRow]] = [matrix[currentRow + pivotRow]!, matrix[currentRow]!];
        pivotCol[currentRow] = col;
        const pivot = matrix[currentRow]![col]!;
        
        for (let row = currentRow + 1; row < numCounters; row++) {
            if (!isZero(matrix[row]![col]!)) {
                const factor = div(matrix[row]![col]!, pivot);
                for (let k = col; k <= numButtons; k++) {
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
        for (let k = 0; k <= numButtons; k++) matrix[row]![k] = div(matrix[row]![k]!, pivot);
        for (let upperRow = 0; upperRow < row; upperRow++) {
            if (!isZero(matrix[upperRow]![col]!)) {
                const factor = matrix[upperRow]![col]!;
                for (let k = 0; k <= numButtons; k++) {
                    matrix[upperRow]![k] = sub(matrix[upperRow]![k]!, mul(factor, matrix[row]![k]!));
                }
            }
        }
    }
    
    // Check for inconsistency
    for (let row = 0; row < numCounters; row++) {
        if (matrix[row]!.slice(0, numButtons).every(isZero) && !isZero(matrix[row]![numButtons]!)) {
            return null;
        }
    }
    
    // Extract particular solution and null space basis
    const pivotCols = new Set(pivotCol.filter(c => c !== -1));
    const freeCols = Array.from({ length: numButtons }, (_, i) => i).filter(c => !pivotCols.has(c));
    
    const particular = Array(numButtons).fill(0);
    for (let row = 0; row < numCounters; row++) {
        if (pivotCol[row] !== -1) particular[pivotCol[row]!] = toNum(matrix[row]![numButtons]!);
    }
    
    const nullBasis = freeCols.map(freeCol => {
        const basis = Array(numButtons).fill(0);
        basis[freeCol] = 1;
        for (let row = 0; row < numCounters; row++) {
            if (pivotCol[row] !== -1) basis[pivotCol[row]!] = -toNum(matrix[row]![freeCol]!);
        }
        return basis;
    });
    
    if (freeCols.length === 0) {
        return particular.every(v => v >= 0 && Number.isInteger(v)) ? particular.reduce((a, b) => a + b, 0) : null;
    }
    
    // Precompute: for each dimension, max possible correction from basis vectors j..k-1
    const k = freeCols.length;
    const maxRange = Math.max(...target) + 50;
    const maxCorrection: number[][] = nullBasis.map(() => Array(numButtons).fill(0));
    for (let d = k - 1; d >= 0; d--) {
        for (let i = 0; i < numButtons; i++) {
            const absCoef = Math.abs(nullBasis[d]![i]!);
            const later = d < k - 1 ? maxCorrection[d + 1]![i]! : 0;
            maxCorrection[d]![i] = absCoef * maxRange + later;
        }
    }
    
    // Precompute basis sums for ordering t values
    const basisSums = nullBasis.map(b => b.reduce((a, c) => a + c, 0));
    
    let minSum = Infinity;
    const search = (depth: number, current: number[]): void => {
        if (depth === k) {
            if (current.every(v => v >= -1e-9 && Math.abs(v - Math.round(v)) < 1e-9)) {
                const sum = current.reduce((a, b) => a + Math.round(b), 0);
                if (sum < minSum && current.every(v => Math.round(v) >= 0)) minSum = sum;
            }
            return;
        }
        
        // Compute bounds considering what later basis vectors can fix
        const basis = nullBasis[depth]!;
        const maxFix = depth < k - 1 ? maxCorrection[depth + 1]! : null;
        
        let lo = -maxRange, hi = maxRange;
        for (let i = 0; i < numButtons; i++) {
            const coef = basis[i]!;
            if (Math.abs(coef) < 1e-9) continue;
            const needMin = maxFix ? -maxFix[i]! : 0;
            const bound = (needMin - current[i]!) / coef;
            if (coef > 0) lo = Math.max(lo, Math.ceil(bound - 1e-9));
            else hi = Math.min(hi, Math.floor(bound + 1e-9));
        }
        
        if (lo > hi) return;
        
        // Order t values to find smaller sums first
        const basisSum = basisSums[depth]!;
        const start = basisSum >= 0 ? lo : hi;
        const step = basisSum >= 0 ? 1 : -1;
        
        for (let t = start; t >= lo && t <= hi; t += step) {
            const next = current.map((v, i) => v + t * basis[i]!);
            search(depth + 1, next);
        }
    };
    
    search(0, [...particular]);
    return minSum === Infinity ? null : minSum;
}

export function part_1(input: string[]): number {
    return input.reduce((sum, line) => {
        const m = parseMachine(line);
        return sum + solveGF2(m.toggles, m.indicatorLights);
    }, 0);
}

export function part_2(input: string[]): number {
    return input.reduce((sum, line) => {
        const m = parseMachine(line);
        return sum + (solveIntegerSystem(m.toggles, m.joltageLevels) ?? 0);
    }, 0);
}