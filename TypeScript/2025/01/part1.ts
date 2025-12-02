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
  let pointAt = 50;
  const valuesCount = 100;

  for (const line of lines) {
    const [direction, valueStr] = [line.charAt(0), line.slice(1)];
    const value = Number(valueStr)
    const rotationFactor = direction === "R" ? 1 : -1;
    
    const rawPoint = pointAt + rotationFactor * value;
    pointAt = rawPoint % valuesCount;
    if(pointAt < 0){
      pointAt += valuesCount;
    }
    if(pointAt == 0){
      result++;
    }
  }

  console.log(result);
}

main();
