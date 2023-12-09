export const INPUT_SPLIT = "\n"
export function part_1(lines: string[]): number {
    const regex_numbers = /(\d+)/g

    let sum = 0

    lines.forEach((l, row, arr) => {
        let match;
        while ((match = regex_numbers.exec(l)) != null) {
            if(isEnginePart(row, arr, match.index, match[0].length)) sum += parseInt(match[0])
        }
    })

    function isEnginePart(row: number, arr: string[], index: number, length: number) {
        const before_char = arr[row]![index - 1]
        if(before_char?.replace(/[0-9.]+/, "")) return true;
        const after_char = arr[row]![index + length]
        if(after_char?.replace(/[0-9.]+/, "")) return true;
        const before_row = arr[row - 1]?.substring(index - 1, index + length + 1)
        if(before_row?.replace(/[0-9.]+/, "")) return true;
        const after_row = arr[row + 1]?.substring(index - 1, index + length + 1)
        if(after_row?.replace(/[0-9.]+/, "")) return true;
        return false;
    }

    return sum
}


export function part_2(lines: string[]): number {
    const gear_regex = /\*/g
    const numbers_regex = /(\d+)/g
    const before_number_regex = /\.{0,2}(\d+)$/
    const after_number_regex = /^(\d+)\.{0,2}/

    let sum = 0;

    lines.forEach((l, row, arr) => {
        let match;
        while ((match = gear_regex.exec(l)) != null) {
            findAdjacent(row, arr, match.index)
        }
    })

    function findAdjacent(row: number, arr: string[], index: number) {
        const nums = []
        const before_row = arr[row - 1]!.substring(index - 3, index + 4)
        if(before_row) nums.push(...getNumbersFromAdjacentRow(before_row))

        const after_row = arr[row + 1]!.substring(index - 3, index + 4)
        if(after_row) nums.push(...getNumbersFromAdjacentRow(after_row))

        const before_gear = arr[row]!.substring(index - 3, index)
        const before_gear_match = before_number_regex.exec(before_gear)
        if(before_gear_match) nums.push(parseInt(before_gear_match[1]!))

        const after_gear = arr[row]!.substring(index + 1, index + 4)
        const after_gear_match = after_number_regex.exec(after_gear)
        if(after_gear_match) nums.push(parseInt(after_gear_match[1]!))

        if(nums.length > 1) sum += nums[0]! * nums[1]!
    }

    function getNumbersFromAdjacentRow(row: string) {
        const numbers = []
        if(isNaN(parseInt(row[2]!))) row = "..." + row.substring(3)
        if(isNaN(parseInt(row[4]!))) row = row.substring(0, 4) + "..."

        // remove trailing numbers
        row = row.replace(/(\.+\d$)|(^\d\.+)/g, "..")

        let match
        while ((match = numbers_regex.exec(row)) != null) {
            numbers.push(parseInt(match[0]))
        }

        return numbers
    }

    return sum
}