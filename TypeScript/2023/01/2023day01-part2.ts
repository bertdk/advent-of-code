import * as fs from "fs";
import path from "path";

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");

  const validNumbers: { [key: string]: number } = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  const numbers = lines.map((line) => {
    const first = Object.keys(validNumbers).reduce(
      (p, c) => {
        const index = line.indexOf(c);
        if (index === -1) return p;
        if (p.index < index) return p;
        return { value: validNumbers[c], index };
      },
      { value: 0, index: line.length }
    ).value;
    const second = Object.keys(validNumbers).reduce(
      (p, c) => {
        const index = line.lastIndexOf(c);
        if (index === -1) return p;
        if (p.index > index) return p;
        return { value: validNumbers[c], index };
      },
      { value: 0, index: 0 }
    ).value;

    return first! * 10 + second!;
  });
  const result = numbers.reduce((p, c) => p + c, 0);
  console.log(result);
};

main();
