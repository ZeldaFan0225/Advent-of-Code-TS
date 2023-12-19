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
    property?: string
}

interface Workflow {
    rules: Rule[],
    apply_rules: (part: Part) => string
}

export const INPUT_SPLIT = "\n\n";
export function part_1(input: [string, string]): number {
    const [workflows, parts] = input
    const wf = parseWorkflows(workflows)
    const p = parseParts(parts)
    const result = getAcceptedPartsCount(p, wf)
    return result
}


export function part_2(input: [string, string]): number {
    return input.length
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
                property: property as string
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