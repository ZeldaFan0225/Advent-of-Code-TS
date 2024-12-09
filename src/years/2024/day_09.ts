export const INPUT_SPLIT = "";
export function part_1(input: string[]): number {
    const driveMap = []
    let id = 0;
    let isFile = true;
    for(const file of input) {
        const count = parseInt(file);
        for(let i = 0; i < count; i++) {
            driveMap.push(isFile ? id : null);
        }
        if(isFile) id++;
        isFile = !isFile;
    }

    let i = 0;
    let j = driveMap.length - 1;
    let result = 0;
    while(i < j) {
        while(driveMap[i] !== null) {
            result += i * driveMap[i]!;
            i++;
        }
        while(driveMap[j] === null) j--;
        if(i < j) {
            driveMap[i] = driveMap[j];
            driveMap[j] = null;
        }
    }

    return result
}


export function part_2(input: string): number {
    return input.length
}