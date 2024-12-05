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
        
        let printing = l.split(",");
        const currentRules: {[x: string]: string[]} = {};

        const invalids = printing.reduce<string[]>((prev, current, i) => {
            const rule = rules[current]?.filter(x => l.includes(x));
            if(!rule || rule.length == 0) return prev;

            currentRules[current] = rule
            
            const willPrint = printing.slice(i + 1, printing.length)
            const isInvalid = willPrint.some(next => rule.includes(next))
            if(isInvalid){
                return [...prev, current]
            }

            return prev;
        }, [])
        
        if(invalids.length == 0){
            return p;
        }

        invalids.forEach(invalid => {
            const newIndex = Math.max(...currentRules[invalid].map(x => printing.indexOf(x)));
            const currentIndex = printing.indexOf(invalid);

            printing.splice(currentIndex, 1)
            printing = [...printing.slice(0, newIndex), invalid, ...printing.slice(newIndex, printing.length)]
        })
        
        return p + Number(printing[Math.floor(printing.length / 2)]);
    }, 0)
    console.log(result)
}

main();