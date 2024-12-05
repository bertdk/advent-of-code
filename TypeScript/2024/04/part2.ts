import { readFileSync } from "fs";
import { join } from "path";

function main(){
    const path = join(__dirname, "input.txt");
    const input = readFileSync(path).toString().split("\n").filter(x => x.length > 0);

    var countMas = 0;
    const word = "MAS";
    input.forEach((l, row) => {
        if(row < 1 || row >= input.length - 1) return;
        const matches = l.matchAll(/A/gm)
    
        for (const match of matches) {
            const matchIndex = match.index;
            if(matchIndex == undefined || matchIndex < 1 || matchIndex >= l.length - 1) continue;
            var diagonals = [
                `${input[row - 1][matchIndex - 1]}A${input[row + 1][matchIndex + 1]}`,
                `${input[row + 1][matchIndex + 1]}A${input[row - 1][matchIndex - 1]}`,
                `${input[row - 1][matchIndex + 1]}A${input[row + 1][matchIndex - 1]}`,
                `${input[row + 1][matchIndex - 1]}A${input[row - 1][matchIndex + 1]}`,
            ]
            const countInDiagonals = diagonals.reduce((p, c) => word == c ? p + 1 : p, 0)
            if(countInDiagonals > 1) countMas++
        }
    })

    console.log(countMas)
}

main();