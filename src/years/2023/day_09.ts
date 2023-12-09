export function part_1(input: string): number {
    const functions = input.split("\n")

    const function_values = functions.map(f => f.split(" ").map(n => parseInt(n)))

    let sum = 0;

    for(let funct of function_values) {
        let derived_values = [funct]
        while(derived_values.at(-1)?.some(n => n !== 0)) {
            const derived = getDerivedValues(derived_values.at(-1)!)
            derived_values.push(derived)
        }

        derived_values.at(-1)?.push(0)

        for(let i = derived_values.length - 1; i > 0; i--) {
            const diff = derived_values[i]?.at(-1)!
            derived_values[i - 1]?.push(derived_values[i - 1]?.at(-1)! + diff)
        }

        sum += derived_values[0]?.at(-1) || 0
    }

    function getDerivedValues(values: number[]) {
        const result = []
        for(let i = 1; i < values.length; i++) {
            result.push(values[i]! - values[i - 1]!)
        }
        return result;
    }

    return sum
}


export function part_2(input: string): number {
    const functions = input.split("\n")

    const function_values = functions.map(f => f.split(" ").map(n => parseInt(n)))

    let sum = 0

    for(let funct of function_values) {
        let derived_values = [funct]
        while(derived_values.at(-1)?.some(n => n !== 0)) {
            derived_values.push(getDerivedValues(derived_values.at(-1)!))
        }

        derived_values.at(-1)?.unshift(0)

        for(let i = derived_values.length - 1; i > 0; i--) {
            const diff = derived_values[i]?.[0]!
            derived_values[i - 1]?.unshift(derived_values[i - 1]![0]! - diff)
        }

        sum += derived_values?.at(0)?.at(0) || 0
    }

    function getDerivedValues(values: number[]) {
        const result = []
        for(let i = 1; i < values.length; i++) {
            result.push(values[i]! - values[i - 1]!)
        }
        return result;
    }

    return sum
}