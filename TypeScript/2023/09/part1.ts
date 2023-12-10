import { readFileSync } from "fs";
import { join } from "path";

const lastElement = <T>(list: T[]) => {
  return list[list.length - 1];
};

const main = () => {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");

  const nextValues = lines.map((line) => {
    const sequences = [line.split(" ").map((x) => Number(x))];
    let lastRow = lastElement(sequences);
    while (lastRow.some((x) => x != 0)) {
      const newRow = [];
      for (let index = 0; index < lastRow.length - 1; index++) {
        const element = lastRow[index + 1] - lastRow[index];
        newRow.push(element);
      }
      sequences.push(newRow);
      lastRow = newRow;
    }

    const newElements = [0];

    for (let index = sequences.length - 2; index >= 0; index--) {
      const currentRow = sequences[index];
      const previousRow = sequences[index + 1];
      const element = lastElement(currentRow) + lastElement(previousRow);
      newElements.push(element);
      sequences[index].push(element);
    }
    return newElements[newElements.length - 1];
  });

  const result = nextValues.reduce((p, c) => p + c, 0);
  console.log(result);
};

main();
