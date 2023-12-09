import {Command, Option} from "commander"
import {existsSync, readFileSync, writeFileSync} from "fs";
import {join} from "path"
const program = new Command()

enum InputTypes {
    "FULL_INPUT_DATA",
    "SAMPLE_INPUT_DATA"
}

interface DayFile {
    part_1: (input: string) => number
    part_2: (input: string) => number
}

function run_day(day: number, year: number, sample_data: InputTypes, log_time: boolean, part?: number) {
    const script_path = join(__dirname, "./years", year.toString(), `day_${day.toString().padStart(2, "0")}.js`),
        sample_input_path = join(__dirname, "../inputs", year.toString(), `day_${day.toString().padStart(2, "0")}_sample.txt`),
        full_input_path = join(__dirname, "../inputs", year.toString(), `day_${day.toString().padStart(2, "0")}.txt`)

    if(!existsSync(script_path))
        throw new Error("Day not found")

    if(sample_data === InputTypes.SAMPLE_INPUT_DATA && !existsSync(sample_input_path))
        throw new Error("Sample Input not found")

    if(sample_data === InputTypes.FULL_INPUT_DATA && !existsSync(full_input_path))
        throw new Error("Input not found")

    const {part_1, part_2} = require(script_path) as DayFile

    const input = readFileSync(sample_data === InputTypes.SAMPLE_INPUT_DATA ? sample_input_path : full_input_path, "utf8").replaceAll("\r", "")

    if(!input.length)
        throw new Error("Input is empty")

    if(!part || part == 1) executeAndLog(part_1, 1, input, log_time)
    if(!part || part == 2) executeAndLog(part_2, 2, input, log_time)
}

function executeAndLog(part_funct: (input: string) => number, part: number, input: string, log_time: boolean) {
    if(log_time) console.time(`Part ${part} Time taken`)
    const result = part_funct(input)
    if(log_time) console.timeEnd(`Part ${part} Time taken`)
    console.log(`Part ${part} result: ${result}`)
}

program
    .name("AoC Days")
    .description("A collection of all of my solved AoC Days")
    .version("0.0.1")

program
    .command("run")
    .argument("<day>", "The day to run")
    .addOption(new Option("-y, --year <year>", 'The year to run').default(new Date().getFullYear().toString()))
    .addOption(new Option("-p, --part <part>", 'The part to run'))
    .addOption(new Option("-s, --sample-data", 'Whether to use sample data').default(false))
    .addOption(new Option("-t, --log-time", 'Whether to log time').default(true))
    .action((day, options) => {
        run_day(parseInt(day), options.year, options.sampleData ? InputTypes.SAMPLE_INPUT_DATA : InputTypes.FULL_INPUT_DATA, options.logTime, options.part)
    })

program
    .command("init_day")
    .argument("<day>", "The day to init")
    .addOption(new Option("-y, --year <year>", 'The year to run').default(new Date().getFullYear().toString()))
    .action((day, {year}) => {
        const script_path = join(__dirname, "../src/years", year.toString(), `day_${day.toString().padStart(2, "0")}.ts`),
            sample_input_path = join(__dirname, "../inputs", year.toString(), `day_${day.toString().padStart(2, "0")}_sample.txt`),
            full_input_path = join(__dirname, "../inputs", year.toString(), `day_${day.toString().padStart(2, "0")}.txt`);
        writeFileSync(script_path, "export function part_1(input: string): number {\n\n}\n\n\nexport function part_2(input: string): number {\n\n}")
        writeFileSync(sample_input_path, "")
        writeFileSync(full_input_path, "")

        console.log("Files created")
    })

program.parse();