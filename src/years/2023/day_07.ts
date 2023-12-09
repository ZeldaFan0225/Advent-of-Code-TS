
type Cards = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A"
interface Deck {
    bid: number,
    deck: string,
    type: number
}

export function part_1(input: string): number {
    const lines = input.split("\n")

    const card_types = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]

    const decks: Deck[] = lines.map(l => {
        const [deck, bid] = l.split(" ")
        return {
            bid: parseInt(bid!),
            deck: deck!,
            type: deckStat(deck!)
        }
    })

    function compareDecks(deck_1: Deck, deck_2: Deck) {
        const type_1 = deck_1.type
        const type_2 = deck_2.type
        if(type_1 < type_2) return -1
        else if(type_1 > type_2) return 1

        let result = 0
        //decks are of same type
        for(let i = 0; i < deck_1.deck.length; i++) {
            if(card_types.indexOf(deck_1.deck[i]!) < card_types.indexOf(deck_2.deck[i]!)) {
                result = -1
                break;
            }
            if(card_types.indexOf(deck_1.deck[i]!) > card_types.indexOf(deck_2.deck[i]!)) {
                result = 1
                break;
            }
        }

        return result
    }

    function deckStat(deck: string) {
        const cards = deck.split("") as Cards[]
        let type = 1
        const cards_count = {
            "A": 0, "K": 0, "Q": 0, "J": 0, "T": 0, "9": 0, "8": 0, "7": 0, "6": 0, "5": 0, "4": 0, "3": 0, "2": 0
        }

        for(let card of cards) {
            cards_count[card] += 1
        }

        const counts = Object.values(cards_count)

        if(counts.includes(5)) type = 7
        else if(counts.includes(4)) type = 6
        else if(counts.includes(3) && counts.includes(2)) type = 5
        else if(counts.includes(3)) type = 4
        else if(counts.indexOf(2) !== -1 && counts.indexOf(2) !== counts.lastIndexOf(2)) type = 3
        else if(counts.includes(2)) type = 2

        return type
    }

    let winnings = 0
    const sorted = decks.sort(compareDecks)

    for(let i = 0; i < sorted.length; i++) {
        winnings += ((i+1) * sorted[i]!.bid)
    }

    return winnings
}


export function part_2(input: string): number {
    const lines = input.split("\n")

    const card_types = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"]

    const decks: Deck[] = lines.map(l => {
        const [deck, bid] = l.split(" ")
        return {
            bid: parseInt(bid!),
            deck: deck!,
            type: deckStat(deck!)
        }
    })

    function compareDecks(deck_1: Deck, deck_2: Deck) {
        const type_1 = deck_1.type
        const type_2 = deck_2.type
        if(type_1 < type_2) return -1
        else if(type_1 > type_2) return 1

        let result = 0
        //decks are of same type
        for(let i = 0; i < deck_1.deck.length; i++) {
            if(card_types.indexOf(deck_1.deck[i]!) < card_types.indexOf(deck_2.deck[i]!)) {
                result = -1
                break;
            }
            if(card_types.indexOf(deck_1.deck[i]!) > card_types.indexOf(deck_2.deck[i]!)) {
                result = 1
                break;
            }
        }

        return result
    }

    function deckStat(deck: string) {
        const cards = deck.split("") as Cards[]
        let type = 1
        const cards_count = {
            "A": 0, "K": 0, "Q": 0, "J": 0, "T": 0, "9": 0, "8": 0, "7": 0, "6": 0, "5": 0, "4": 0, "3": 0, "2": 0
        }

        for(let card of cards) {
            cards_count[card] += 1
        }

        // move the card count from J to the highest count; don't compare to J as it can be the highest
        let largest: Cards = "A"
        for(let card of card_types.slice(1) as Cards[]) {
            if(cards_count[card] >= cards_count[largest]) largest = card
        }

        cards_count[largest] += cards_count["J"]
        delete cards_count["J" as Cards]

        const counts = Object.values(cards_count)

        if(counts.includes(5)) type = 7
        else if(counts.includes(4)) type = 6
        else if(counts.includes(3) && counts.includes(2)) type = 5
        else if(counts.includes(3)) type = 4
        else if(counts.indexOf(2) !== -1 && counts.indexOf(2) !== counts.lastIndexOf(2)) type = 3
        else if(counts.includes(2)) type = 2

        return type
    }

    let winnings = 0
    const sorted = decks.sort(compareDecks)

    for(let i = 0; i < sorted.length; i++) {
        winnings += ((i+1) * sorted[i]!.bid)
    }

    return winnings
}