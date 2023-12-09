export function part_1(input: string): number {
    const games_raw = input.split("\n")

    const count = {
        red: 12,
        green: 13,
        blue: 14
    }

    const games = games_raw.map((game, i) => {
        const rounds = game.replace(/Game \d+ : /, "").split("; ").map(round => {
            const color_count = {
                red: 0,
                green: 0,
                blue: 0
            }

            round.split(", ").forEach(color => {
                const stat = /(\d+) (red|green|blue)/.exec(color)
                color_count[stat![2]! as "red" | "green" | "blue"] = parseInt(stat![1]!)
            })

            return color_count
        })

        return {
            id: i+1,
            rounds
        }
    })

    let sum = 0
    games.forEach(g => {
        if(g.rounds.every(round =>
            (
                round.blue <= count.blue &&
                round.red <= count.red &&
                round.green <= count.green
            )
        )) sum += g.id
    })

    return sum
}


export function part_2(input: string): number {
    const games_raw = input.split("\n")

    const games = games_raw.map((game) => {
        return game.replace(/Game \d+ : /, "").split("; ").map(round => {
            const color_count = {
                red: 0,
                green: 0,
                blue: 0
            }

            round.split(", ").forEach(color => {
                const stat = /(\d+) (red|green|blue)/.exec(color)
                color_count[stat![2]! as "red" | "green" | "blue"] = parseInt(stat![1]!)
            })

            return color_count
        })
    })

    let sum = 0
    games.map(g => {
        const required = {
            red: 0,
            green: 0,
            blue: 0
        }

        g.forEach(round => {
            if(round.red > required.red) required.red = round.red;
            if(round.green > required.green) required.green = round.green;
            if(round.blue > required.blue) required.blue = round.blue;
        })

        // Calculate power of bag
        sum += (required.red * required.green * required.blue)
    })

    return sum
}