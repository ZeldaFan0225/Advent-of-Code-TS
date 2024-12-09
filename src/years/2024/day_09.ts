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


// start & end are inclusive
type File = {start: number, end: number, id: number}
export function part_2(input: string, visualize?: boolean): number {
    const files: File[] = []
    let id = 0;
    let isFile = true;
    let index = 0;
    for(const file of input) {
        const count = parseInt(file);
        if(isFile) {
            files.push({
                start: index,
                end: (index += count) - 1,
                id
            })
        } else {
            index += count;
        }
        if(isFile) id++;
        isFile = !isFile;
    }

    let i = files.length- 1;
    while(i > 0) {
        const fileWidth = (files[i]!.end - files[i]!.start + 1)
        const position = files.findIndex((val, i, arr) => arr[i+1] ? (arr[i+1]!.start - val.end - 1) >= fileWidth : false)
        if(position >= 0 && position < i) {
            const file = files.splice(i, 1)[0]!
            if(!file) throw new Error("Error")
            file.start = files[position]!.end + 1
            file.end = file.start + fileWidth - 1;
            files.splice(position + 1, 0, file)
        } else {
            i--;
        }
    }

    let res = 0;
    files.forEach(f => res += calculateFileValue(f))

    if(visualize) printFiles(files)

    return res
}

function calculateFileValue(file: File) {
    let res = 0
    for(let i = file.start; i <= file.end; i++) {
        res += file.id * i;
    }
    return res;
}

function printFiles(files: File[]) {
    let res = ""
    let prevEnd = 0;
    for(const file of files) {
        const fileWidth = file.end - file.start + 1;
        res += ".".repeat(file.start - prevEnd);
        prevEnd = file.end + 1;
        res += file.id.toString().repeat(fileWidth);
    }
    console.log(res)
}