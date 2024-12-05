import { readFileSync } from "fs";
import { join } from "path";

function main(){
    const path = join(__dirname, "input.txt");
    const input = readFileSync(path).toString().split("\n").filter(x => x.length > 0);

    var countXmas = 0;
    const word = "XMAS".split("")
    input.forEach((l, row) => {
        const matches = l.matchAll(/X/gm)
        for (const match of matches) {
            const matchIndex = match.index ?? 0;
            // Normal
            if(word.every(((c, i) => compareIfPossible(l, i + matchIndex, c)))){
                countXmas++;
            }
            // Backwards
            if(word.every(((c, i) => compareIfPossible(l,  matchIndex - i, c)))){
                countXmas++;
            }
            // Vertical down
            if(word.every(((c, i) => compareIfPossible(input[row + i], matchIndex, c)))){
                countXmas++;
            }
            // Vertical up
            if(word.every(((c, i) => compareIfPossible(input[row - i], matchIndex, c)))){
                countXmas++;
            }
            // Diagonal left up
            if(word.every(((c, i) => compareIfPossible(input[row - i], matchIndex - i, c)))){
                countXmas++;
            }
            // Diagonal left down
            if(word.every(((c, i) => compareIfPossible(input[row + i], matchIndex - i, c)))){
                countXmas++;
            }
            // Diagonal right up
            if(word.every(((c, i) => compareIfPossible(input[row - i], matchIndex + i, c)))){
                countXmas++;
            }
            // Diagonal right down
            if(word.every(((c, i) => compareIfPossible(input[row + i], matchIndex + i, c)))){
                countXmas++;
            }
        }
    })

    console.log(countXmas)
}

function compareIfPossible(list: string, index: any, eq: string): boolean{
    if(index == undefined || !list || index < 0 || list.length < index){
        return false;
    }

    return list[index] == eq
}

main();