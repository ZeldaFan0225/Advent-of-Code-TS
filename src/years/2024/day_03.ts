export const INPUT_SPLIT = undefined;
export function part_1(input: string): number {
    return processCommands(input, 1);
}

export function part_2(input: string): number {
    return processCommands(input, 2);
}


const WHITELIST = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ",", ")"])
const MATCHDONT = "don't()"
const MATCHDO = "do()"
const MATCHPATTERN = "mul(";

function processCommands(input: string, part: 1 | 2) {
    let dontMatch = false;

    let dontMatchCount = 0;
    let doMatchCount = 0;

    let captureNumbers = false;
    let captureMatchCount = 0;
    let captureBuffer = ""

    let result = 0;

    for(let char of input) {
        if(char === MATCHDONT[dontMatchCount]) {
            if(dontMatchCount === MATCHDONT.length - 1) {
                dontMatch = true;
                dontMatchCount = 0;
            } else {
                dontMatchCount++;
            }
        } else {
            dontMatchCount = 0;
        }

        if(char === MATCHDO[doMatchCount]) {
            if(doMatchCount === MATCHDO.length - 1) {
                dontMatch = false;
                doMatchCount = 0;
            } else {
                doMatchCount++;
            }
        } else {
            doMatchCount = 0;
        }

        if(char === MATCHPATTERN[captureMatchCount]) {
            captureBuffer = ""
            if(captureMatchCount === MATCHPATTERN.length - 1) {
                captureNumbers = true;
                captureMatchCount = 0;
                continue;
            } else {
                captureMatchCount++;
            }
        } else {
            captureMatchCount = 0;
        }

        if(captureNumbers) {
            if(!WHITELIST.has(char)) {
                captureNumbers = false;
                captureBuffer = "";
                continue;
            }
            if(char === ")") {
                captureNumbers = false;
                if(!dontMatch || part === 1) {
                    const [l, r] = captureBuffer.split(",").map(a => parseInt(a));
                    if(!isNaN(l!) && !isNaN(r!)) {
                        result += l! * r!;
                    }
                }
                captureBuffer = "";
            } else {
                captureBuffer += char;
            }
        }
    }

    return result;
}