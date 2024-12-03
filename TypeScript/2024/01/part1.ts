import path from "path";
import fs from "fs";

function main(){
    
  const filePath = path.join(__dirname, "input.txt");

  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n").filter(c => c.length > 1);
  const numbers = lines.reduce<{left: number[], right: number[]}>((p, c) => {
    const newNumbers = c.split("   ");
    return {
        left: [...p.left, Number(newNumbers[0])], 
        right: [...p.right, Number(newNumbers[1])], 
    }
  }, {left: [], right: []});

  const sortedRight = numbers.right.sort();
  const result = numbers.left.sort().reduce((p, c, i) => {
    return p + Math.abs(c - sortedRight[i])
  }, 0)

  console.log(result)
}

main();