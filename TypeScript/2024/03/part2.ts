import { readFileSync } from "fs";
import path from "path";

function main(){
    const filePath = path.join(__dirname, "input.txt")

    const file = readFileSync(filePath)
    const lines = file.toString().split("\n").filter(l => l.length > 0)

    const regex = /(?<exec>do\(\)|don't\(\))|(mul\((?<first>\d{1,3}),(?<second>\d{1,3})\))/gm;

    var isEnabled = true;
    const result = lines.reduce<number>((p, c) => {
        const matches = c.matchAll(regex)

        var lineResult = 0;
        for(const match of matches){
            if(match.groups?.exec){
                isEnabled = match.groups.exec == "do()"
            }
            if(isEnabled && match.groups?.first && match.groups?.second){
                lineResult += Number(match.groups.first) * Number(match.groups.second)
            }
        }
        return p + lineResult;
    }, 0)

    console.log(result)
}

main();