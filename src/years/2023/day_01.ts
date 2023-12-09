export function part_1(input: string): number {
    const codes = input.split("\n")

    let sum = 0

    for(let code of codes) {
        let first, last;

        for(let char of code.split("")) {
            const parsed = parseInt(char)
            if(!isNaN(parsed)) {
                if(first === undefined) first = parsed
                last = parsed
            }
        }

        sum += (first! * 10 + last!)
    }

    return sum
}

export function part_2(input: string): number {
    const codes = input.split("\n")

    const nums = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    let sum = 0

    for(let code of codes) {
        let first, last;

        for(let i = 0; i < code.length; i++) {
            let parsed = parseInt(code[i]!);
            if(isNaN(parsed)) {
                const num = nums.find(n => code.substring(i).startsWith(n))
                parsed = nums.indexOf(num!) + 1
            }

            if(parsed) {
                if(first === undefined) first = parsed
                last = parsed
            }
        }
        sum += (first! * 10 + last!)
    }

    return sum
}