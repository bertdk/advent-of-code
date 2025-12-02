import * as fs from "fs";
import * as path from "path";

function main() {
  const filePath = path.join(__dirname, "input.txt");

  const file = fs.readFileSync(filePath);
  const lines = file
    .toString()
    .split("\n")
    .filter((c) => c.length > 1);

  let result = 0;

  let absolutePoint = 50;
  const dialSize = 100;

  for (const line of lines) {
    const direction = line.charAt(0);
    const value = Number(line.slice(1));
    const rotationFactor = direction === "R" ? 1 : -1;

    const currentPos = absolutePoint;
    const nextPos = currentPos + rotationFactor * value;

    if (direction === "R") {
      result +=
        Math.floor(nextPos / dialSize) - Math.floor(currentPos / dialSize);
    } else {
      result +=
        Math.ceil(currentPos / dialSize) - Math.ceil(nextPos / dialSize);
    }

    absolutePoint = nextPos;
  }

  console.log(result);
}

main();
