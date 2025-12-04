import path from "path";
import fs from "fs";

function main() {
  const filePath = path.join(__dirname, "input.txt");

  const file = fs.readFileSync(filePath);
  const lines = file
    .toString()
    .split("\n")
    .filter((c) => c.length > 1);

  let result = 0;

  for(let line of lines){
    const joltages = line.split("").map(Number)
    let maxJolts = 0;
    for (let index = 0; index < joltages.length; index++) {
      const jolts = joltages[index] * 10 + Math.max(...joltages.slice(index + 1))
      if(jolts > maxJolts){
        maxJolts = jolts;
      }
    }
    result += maxJolts;
  }

  console.log(result);
}

main();
