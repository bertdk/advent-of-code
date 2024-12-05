import { readFileSync } from "fs";
import { join } from "path";

function main(){
    const path = join(__dirname, "input.txt");
    const input = readFileSync(path).toString().split("\n");

    const rules: {[x: string]: string[]} = {};

    const result = input.reduce<number>((p, l, row) => {
        if(l.length <= 0) return p;

        const regex = /(?<before>\d*)\|(?<after>\d*)/gm
        const match = regex.exec(l)
        if(match?.length && match.groups){
            const prev = rules[match.groups.after] ?? [];
            rules[match.groups.after] = [...prev, match.groups.before]
            return p;
        }

        
        const printing = l.split(",");
        const isValid = printing.every((current, i) => {
            const rule = rules[current];
            if(!rule) return true;
            
            const willPrint = printing.slice(i + 1, printing.length)
            return !willPrint.some(next => rule.includes(next))
        })
        
        if(isValid){
            return p + Number(printing[Math.floor(printing.length / 2)])
        }
        
        return p;
        
    }, 0)
    console.log(result)
}

main();