export const INPUT_SPLIT = "\n\n";
export function part_1(input: string[]): number {
    const keys: [number, number, number, number, number][] = [];
    const locks: [number, number, number, number, number][] = [];
    for(const schema of input) {
        let sum = [-1, -1, -1, -1, -1] as [number, number, number, number, number];
        for(const line of schema.split("\n")) {
            for(let i = 0; i < 5; i++) {
                sum[i]! += line[i] === "#" ? 1 : 0;
            }
        }
        if(schema[0] === ".") {
            keys.push(sum);
        } else {
            locks.push(sum);
        }
    }

    let count = 0;
    for(const key of keys) {
        for(const lock of locks) {
            let match = true;
            for(let i = 0; i < 5; i++) {
                if(key[i]! + lock[i]! > 5) {
                    match = false;
                    break;
                }
            }
            if(match) {
                count++;
            }
        }
    }

    return count;
}


export function part_2(input: string[]): string {
    return "Merry Christmas!";
}