import path from "path";
import fs from "fs";

function main(){

    const filePath = path.join(__dirname, "input.txt");

    const file = fs.readFileSync(filePath);
    const lines = file.toString().split("\n").filter(c => c.length > 1);
    const result = lines.reduce<number>((p, c) => {
        const levels = c.split(" ").map(x => Number(x));
        const isIncrease = (levels[1] - levels[0]) > 0
        
        for (let index = 0; index < levels.length - 1; index++) {
            const currentLevel = levels[index];
            const nextLevel = levels[index + 1];
            
            const difference = nextLevel - currentLevel;
            if(Math.abs(difference) < 1 || Math.abs(difference) > 3){
                return p;
            }

            const currentIncrease = difference > 0
            if(isIncrease != currentIncrease){
                return p;
            }
        }
        return p + 1;
    }, 0)
    console.log(result)
}

main()