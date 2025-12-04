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
  const digitCount = 12;

  for (let line of lines) {
    const joltages = line.split("").map(Number);
    let maxJolts = 0;
    let lastMaxIndex = 0;
    for (let index = 1; index <= digitCount; index++) {
      const options = joltages.slice(
        lastMaxIndex,
        joltages.length - digitCount + index
      );
      const max = Math.max(...options);
      lastMaxIndex += options.indexOf(max) + 1

      maxJolts += max * 10 ** (digitCount - index);
    }
    result += maxJolts;
  }

  console.log(result);
}

main();
