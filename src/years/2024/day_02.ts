import { parse } from "path";

export const INPUT_SPLIT = "\n";
export function part_1(input: string[]): number {
    const reports = input.map(i => i.split(" ").map(a => parseInt(a)))
    let valid = 0
    for(const report of reports) {
        let prevSign = 0
        let validCount = 0
        for(let i = 0; i < report.length - 1; i++) {
            let delta = report[i+1]! - report[i]!
            let sign = Math.sign(delta)
            if(Math.abs(delta) >= 1 && Math.abs(delta) <= 3) {
                if(prevSign == 0) {
                    validCount++
                } else if(prevSign == sign) {
                    validCount++
                } else {
                    break;
                }
            } else {
                break;
            }
            prevSign = sign
        }
        if(validCount == report.length - 1) {
            valid++
        }
    }
    return valid
}


export function part_2(input: string[]): number {
    const reports = input.map(i => i.split(" ").map(a => parseInt(a)))
    let valid = 0
    for(const report of reports) {
        let prevSign = 0
        let validCount = 0
        for(let i = 0; i < report.length - 1; i++) {
            let delta = report[i+1]! - report[i]!
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
        if(validCount >= report.length - 2) {
            valid++
        }
    }
    return valid
}