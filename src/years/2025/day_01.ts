export const INPUT_SPLIT = undefined;
function real_mod(number: number, modulus: number): number {
    while(number < 0) {
        number += modulus;
    }
    return number % modulus;
}
export function part_1(input: string): number {
    let current = 50;
    let res = 0;
    for (const line of input.split('\n')) {
        const [direction, ...amount] = line.split('');
        const value = parseInt(amount.join(''));
        current += real_mod(direction === "L" ? -value : value, 100);
        current = real_mod(current, 100);
        if(current === 0) {
            res++;
        }
    }
    return res;
}


export function part_2(input: string): number {
    let current = 50;
    let res = 0;
    for (const line of input.split('\n')) {
        const [direction, ...amount] = line.split('');
        const value = parseInt(amount.join(''));
        const isLeft = direction === "L";
        
        const stepsToZero = current === 0 ? 100 : (isLeft ? current : 100 - current);
        res += Math.floor(value / 100) + (value % 100 >= stepsToZero ? 1 : 0);
        current = real_mod(current + (isLeft ? -value : value), 100);
    }
    return res;
}