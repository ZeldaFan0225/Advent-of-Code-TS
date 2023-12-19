interface Part {
    x: number,
    m: number,
    a: number,
    s: number
}

interface Rule {
    then: string,
    greater_than?: boolean,
    num?: number,
    property?: "x" | "m" | "a" | "s"
}

interface Workflow {
    rules: Rule[],
    apply_rules: (part: Part) => string
}

type Borders = Record<"x" | "m" | "a" | "s", {min: number, max: number}>

export const INPUT_SPLIT = "\n\n";
export function part_1(input: [string, string]): number {
    const [workflows, parts] = input
    const wf = parseWorkflows(workflows)
    const p = parseParts(parts)
    return getAcceptedPartsCount(p, wf)
}


export function part_2(input: [string, string]): number {
    const [wfstring] = input
    const workflows = parseWorkflows(wfstring)
    const result = findAllPossibleCombinations("in", {
        x: {min: 0, max: 4000},
        m: {min: 0, max: 4000},
        a: {min: 0, max: 4000},
        s: {min: 0, max: 4000},
    })

    console.log(result)

    return result;

    function findAllPossibleCombinations(workflow: string, borders: Borders): number {
        const single_results = []
        if(workflow === "R") return 0;
        if(workflow === "A") {
            console.log(getCombinationsFromBorder(borders))
            console.log(borders)
        }
        if(workflow === "A") return getCombinationsFromBorder(borders);
        const rules = workflows.get(workflow)
        if(!rules) {
            console.log("No Rule Found");
            return 0;
        }
        console.log(borders)
        console.log(workflow)
        for(let rule of rules) {
            console.log(rule)
            if(!rule.num || !rule.property) {
                single_results.push(findAllPossibleCombinations(rule.then, borders))
                break;
            }

            const rule_border: Borders = {
                x: {min: borders.x.min, max: borders.x.max},
                m: {min: borders.m.min, max: borders.m.max},
                a: {min: borders.a.min, max: borders.a.max},
                s: {min: borders.s.min, max: borders.s.max},
            }
            // play around with these parameters to see
            rule_border[rule.property] = rule.greater_than ? {min: rule.num + 1, max: rule_border[rule.property].max} : {min: rule_border[rule.property].min, max: rule.num - 1}
            single_results.push(findAllPossibleCombinations(rule.then, rule_border))

            borders[rule.property] = rule.greater_than ? {min: borders[rule.property].min, max: rule.num} : {min: rule.num, max: borders[rule.property].max}
        }

        return single_results.reduce((a, b) => a + b)
    }

    function getCombinationsFromBorder(borders: Borders) {
        return Object.values(borders).map(v => v.max - v.min).reduce((a, b) => a * b)
    }
}

function getAcceptedPartsCount(parts: Part[], workflows: Map<string, Rule[]>): number {
    const accepted: Part[] = []
    let count = 0
    for(let part of parts) {
        let result = "in"
        while(result !== "A" && result !== "R") {
            const workflow = workflows.get(result)
            if(!workflow) throw new Error(`Workflow ${result} not found`)
            result = applyRules(part, workflow)
        }

        if(result === "A") count += (part.x + part.m + part.a + part.s)
    }

    return count
}

function applyRules(part: Part, rules: Rule[]) {
    let result = ""
    for(let rule of rules) {
        if(!rule.num || !rule.property) {
            result = rule.then;
            break;
        }
        if((rule.greater_than && part[rule.property as "x" | "m" | "a" | "s"] > rule.num) || (!rule.greater_than && part[rule.property as "x" | "m" | "a" | "s"] < rule.num)) {
            result = rule.then
            break;
        }
    }
    return result;
}


const workflowregex = /(?<rulename>[a-z]+)\{(?<rulesstr>.+)+}/
const ruleregex = /(?<property>[xmas])[<>](?<num>\d+)/
function parseWorkflows(workflows: string) {
    const map = new Map<string, Rule[]>()
    const result = []
    for(let workflow of workflows.split("\n")) {
        const {rulename, rulesstr} = workflowregex.exec(workflow)?.groups! ?? {}
        if(!rulename || !rulesstr) continue;

        const rules: Rule[] = rulesstr.split(",").map(r => {
            if(!r.includes(":")) return {then: r}
            const [condition, then] = r.split(":")
            if(!condition) throw new Error("Parsing failed")
            const {property, num} = ruleregex.exec(condition!)?.groups! ?? {}
            return {
                then: then!,
                greater_than: r.includes(">"),
                num: parseInt(num as string),
                property: property as "x" | "m" | "a" | "s"
            }
        })

        map.set(rulename, rules)
    }

    return map
}

function parseParts(partsstr: string) {
    const parts = partsstr.split("\n")
    return parts.map(p => {
        const result: Partial<Part> = {}
        p.replace(/[{}]/g, "").split(",").forEach(p => {
            const [key, value] = p.split("=") as ["x" | "m"| "a" | "s", string]
            result[key] = parseInt(value)
        })
        return result as Part
    })
}