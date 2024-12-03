import path from "path";
import fs from "fs";

function getUnsaveIndex(levels: number[]){
    const isIncrease = (levels[1] - levels[0]) > 0

    for (let index = 0; index < levels.length - 1; index++) {
        const currentLevel = levels[index];
        const nextLevel = levels[index + 1];
        
        const difference = nextLevel - currentLevel;
        if(Math.abs(difference) < 1 || Math.abs(difference) > 3){
            return index;
        }
        
        const currentIncrease = difference > 0
        if(isIncrease != currentIncrease){
            return index;
        }
    }
    return -1;
}

function main(){

    const filePath = path.join(__dirname, "input.txt");

    const file = fs.readFileSync(filePath);
    const lines = file.toString().split("\n").filter(c => c.length > 1);
    const result = lines.reduce<number>((p, c) => {
        const levels = c.split(" ").map(x => Number(x));
        const unsaveIndex = getUnsaveIndex(levels);
        if(unsaveIndex < 0){
            // console.log({levels, status: "Save"})
            return p + 1;
        }

        const levelWithoutIndex = [...levels.slice(0, unsaveIndex), ...levels.slice(unsaveIndex + 1, levels.length)];
        if(getUnsaveIndex(levelWithoutIndex) < 0){
            // console.log({levels, levelWithoutIndex, status: "Save"})
            return p + 1;
        }
        
        const levelWithoutNext = [...levels.slice(0, unsaveIndex + 1), ...levels.slice(unsaveIndex + 2, levels.length)];
        if(getUnsaveIndex(levelWithoutNext) < 0){
            // console.log({levels, levelWithoutNext, status: "Save"})
            return p + 1;
        }
        
        if(unsaveIndex > 0){
        const levelWithoutPrevious = [...levels.slice(0, unsaveIndex - 1), ...levels.slice(unsaveIndex, levels.length)];
        if(getUnsaveIndex(levelWithoutPrevious) < 0){
            // console.log({levels, levelWithoutPrevious, status: "Save"})
            return p + 1;
        }}
        
        // console.log({levels, levelWithoutIndex, levelWithoutNext, status: "Unsave", unsaveIndex})
        return p;

    }, 0)
    console.log(result)
}

main()