import { readFileSync } from "fs"
import { join } from "path"

function main(){
    const path = join(__dirname, "input.txt")
    const input = readFileSync(path).toString().split("\n").filter(x => x.length > 0)

    const result = input.reduce((p, c) => {
        const [testValue, ...numbers] = c.split(": ").flatMap(x => x.split(" ")).map(x => Number(x));
        let possibleResults: number[] = [numbers[0]];

        for (let index = 1; index < numbers.length; index++) {
            const element = numbers[index];
            possibleResults = possibleResults.flatMap(x => [x + element, x * element, Number(`${x}${element}`)])
        }

        if(possibleResults.includes(testValue)){
            return p + testValue;
        }
        return p;
    }, 0)

    console.log({result})
}

main()