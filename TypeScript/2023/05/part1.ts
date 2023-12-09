import { readFileSync } from "fs";
import path from "path";

const main = (category: string) => {
  const filePath = path.join(__dirname, "input.txt");
  const file = readFileSync(filePath);
  const lines = file.toString().split("\n");

  const start = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((x) => Number(x));

  let currentCategory = "";
  let currentValues = start;
  let newValues: number[] = [];
  let endOfCategory = false;
  let currentLine = 2;
  while (currentCategory != category || !endOfCategory) {
    const line = lines[currentLine];
    currentLine++;

    const mappingMatch = line.match(/(?<from>\w*)-to-(?<to>\w*) map\:/);
    if (mappingMatch?.groups?.from) {
      currentCategory = mappingMatch?.groups?.to;
      // console.log(`Current category: ${currentCategory}`);
    }

    const rangeMatch = line.match(
      /(?<destination>\d*) (?<source>\d*) (?<step>\d*)/
    );
    if (rangeMatch?.groups?.source) {
      const source = Number(rangeMatch.groups.source);
      const destination = Number(rangeMatch.groups.destination);
      const step = Number(rangeMatch.groups.step);
      const filterValues: number[] = [];

      currentValues.map((x) => {
        if (x >= source && x < source + step) {
          const diff = x - source;
          const newValue = destination + diff;
          newValues.push(newValue);
          filterValues.push(x);
        }
      });

      // console.log(`- ${currentValues} -> ${filterValues} -> ${newValues}`);
      currentValues = currentValues.filter((x) => !filterValues.includes(x));
    }

    endOfCategory = line === "" || lines.length === currentLine;
    if (endOfCategory) {
      // console.log(`- No mapping ${currentValues}`);
      currentValues.push(...newValues);
      newValues = [];
    }
  }

  const result = Math.min(...currentValues);
  console.log(result);
};

main("location");
