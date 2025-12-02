export const INPUT_SPLIT = ",";

function bruteForce1(rangeStart: number, rangeEnd: number): number {
    const diff = rangeEnd - rangeStart;
    let count = 0;
    for(let i = 0; i <= diff; i++) {
        const num = rangeStart + i;
        const digits = Math.floor(Math.log10(num) + 1);
        if(digits % 2 === 1) continue;
        if(Math.floor(num / 10**(digits/2)) === num % 10**(digits/2)) {
            count+=rangeStart + i;
        }
    }
    return count;
}

// Mathematical approach for part 1
// Numbers where first half equals second half are of form n * (10^k + 1)
// where n is a k-digit number (from 10^(k-1) to 10^k - 1)
function mathematical1(rangeStart: number, rangeEnd: number): number {
    let sum = 0;
    
    // Try each possible half-length k (1, 2, 3, ...)
    for (let k = 1; k <= 8; k++) {
        const multiplier = 10 ** k + 1; // e.g., k=2 -> 101 (so 12*101=1212)
        const minBase = 10 ** (k - 1);  // smallest k-digit number (e.g., 10 for k=2)
        const maxBase = 10 ** k - 1;    // largest k-digit number (e.g., 99 for k=2)
        
        // Find range of base values n where n * multiplier is in [rangeStart, rangeEnd]
        const nMin = Math.max(minBase, Math.ceil(rangeStart / multiplier));
        const nMax = Math.min(maxBase, Math.floor(rangeEnd / multiplier));
        
        if (nMin <= nMax) {
            // Sum of n from nMin to nMax: (count * (first + last)) / 2
            const count = nMax - nMin + 1;
            const baseSum = (count * (nMin + nMax)) / 2;
            sum += baseSum * multiplier;
        }
    }
    
    return sum;
}

export function part_1(input: string[]): number {
    const ranges = input.map(l => l.split("-").map(Number)) as [number, number][];
    let count = 0
    for(const [start, end] of ranges) {
        count += mathematical1(start, end)
    }
    return count
}

function bruteForce2(rangeStart: number, rangeEnd: number): number {
    const diff = rangeEnd - rangeStart;
    let count = 0;
    for(let i = 0; i <= diff; i++) {
        const current = rangeStart + i + "";
        const recurring = /^(\d+)(\1){1,}$/.test(current);

        if(recurring) {
            count+=rangeStart + i;
        }
    }
    return count;
}

// Mathematical approach for part 2
// Numbers that are a repeating pattern are of form n * repunit
// where repunit = (10^(k*r) - 1) / (10^k - 1) for pattern length k repeated r times
function mathematical2(rangeStart: number, rangeEnd: number): number {
    let sum = 0;
    const counted = new Set<number>(); // Avoid double-counting (e.g., 1111 = 11*101 = 1*1111)
    
    // Try each possible pattern length k
    for (let k = 1; k <= 8; k++) {
        const minBase = k === 1 ? 1 : 10 ** (k - 1); // smallest k-digit number
        const maxBase = 10 ** k - 1;                  // largest k-digit number
        
        // Try each repetition count r (at least 2)
        for (let r = 2; r <= 16; r++) {
            const totalDigits = k * r;
            if (totalDigits > 16) break; // Beyond reasonable range
            
            // repunit in base 10^k: (10^(k*r) - 1) / (10^k - 1)
            // e.g., k=1, r=3 -> (1000-1)/(10-1) = 111
            // e.g., k=2, r=2 -> (10000-1)/(100-1) = 101
            const multiplier = (10 ** (k * r) - 1) / (10 ** k - 1);
            
            // Find range of base values n where n * multiplier is in [rangeStart, rangeEnd]
            const nMin = Math.max(minBase, Math.ceil(rangeStart / multiplier));
            const nMax = Math.min(maxBase, Math.floor(rangeEnd / multiplier));
            
            for (let n = nMin; n <= nMax; n++) {
                // Skip if n itself is a repeating pattern (to avoid double-counting)
                // e.g., n=11 with k=2, r=2 gives 1111, but n=1 with k=1, r=4 also gives 1111
                const nStr = n.toString();
                if (k > 1) {
                    let isRepeating = false;
                    for (let subK = 1; subK < k; subK++) {
                        if (k % subK === 0) {
                            const pattern = nStr.slice(0, subK);
                            if (pattern.repeat(k / subK) === nStr) {
                                isRepeating = true;
                                break;
                            }
                        }
                    }
                    if (isRepeating) continue;
                }
                
                const num = n * multiplier;
                if (!counted.has(num)) {
                    counted.add(num);
                    sum += num;
                }
            }
        }
    }
    
    return sum;
}

export function part_2(input: string[]): number {
    const ranges = input.map(l => l.split("-").map(Number)) as [number, number][];
    let count = 0
    for(const [start, end] of ranges) {
        count += mathematical2(start, end)
    }
    return count
}