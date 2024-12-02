export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const reports = input.map(i => i.split(" ").map(a => parseInt(a)))
    let valid = 0
    for(const report of reports) {
        if(checkValidity(report)) {
            valid++
        }
    }
    return valid
}

export function part_2(input: string[]): number {
    const reports = input.map(i => i.split(" ").map(a => parseInt(a)))
    let valid = 0
    for(const report of reports) {
        if(checkValidity(report)) {
            valid++;
            continue;
        }
        for(let i = 0; i < report.length; i++) {
            let subarr = report.slice()
            subarr.splice(i, 1)
            if(checkValidity(subarr)) {
                valid++;
                break;
            }
        }
    }
    return valid
}

function checkValidity(report: number[]) {
    let prevSign = 0
    let validCount = 0
    for(let i = 0; i < report.length - 1; i++) {
        let delta = report[i+1]! - report[i]!;
        let sign = Math.sign(delta)
        if(Math.abs(delta) >= 1 && Math.abs(delta) <= 3) {
            if(prevSign == 0) {
                prevSign = sign
                validCount++
            } else if(prevSign == sign) {
                prevSign = sign
                validCount++
            }
        }
    }

    return validCount >= report.length - 1
}