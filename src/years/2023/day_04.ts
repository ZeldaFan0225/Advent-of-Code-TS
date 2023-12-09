export const INPUT_SPLIT = "\n"
export function part_1(lines: string[]): number {
    let sum = 0

    const cards = lines.map(l => {
        const [winning_line, own_line] = l.split(" | ")
        const winning = winning_line!.split(": ")[1]!.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n))
        const own = own_line!.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n))
        return {
            winning,
            own
        }
    })

    cards.forEach(c => {
        return getCardValue(c)
    })

    function getCardValue(card_data: {winning: number[], own: number[]}) {
        let value = 0;
        card_data.own.forEach(own => {
            if(card_data.winning.includes(own)) value = (value || 0.5) * 2
        })
        sum += value
    }

    return sum
}


export function part_2(lines: string[]): number {

    const cards = lines.map((l, i) => {
        const [winning_line, own_line] = l.split(" | ")
        const winning = winning_line!.split(": ")[1]!.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n))
        const own = own_line!.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n))
        return {
            winning,
            own,
            index: i,
            process_amount: 1
        }
    })

    for(let i = 0; i < cards.length; i++) {
        const card = cards[i]!
        const score = getAmountMatching(card)
        for(let ind = card.index + 1; ind <= (card.index + score); ind++) {
            cards[ind]!.process_amount += card.process_amount
        }
    }

    function getAmountMatching(card_data: {winning: number[], own: number[]}) {
        let matching = 0;
        card_data.own.forEach(own => {
            if(card_data.winning.includes(own)) matching++
        })
        return matching
    }

    return cards.map(c => c.process_amount).reduce((a, b) => a + b)
}