import * as fs from "fs";
import path from "path";

const parseNumbers = (line: string) => {
  return line.split(" ").filter((x) => x && x !== " ");
};

const countMatches = (left: string, right: string) => {
  const winning = parseNumbers(left);
  const having = parseNumbers(right);

  return having.reduce((p, x) => (winning.includes(x) ? p + 1 : p), 0);
};

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  // const file =
  //   "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";
  const lines = file.toString().split("\n");

  let total = 0;
  const duplicates = new Map<number, number>();
  lines.map((line, i) => {
    const cardOrder = i;
    const cardDuplicates = duplicates.get(cardOrder) ?? 0;
    total += cardDuplicates + 1;
    duplicates.delete(cardOrder);

    const [cardName, numbers] = line.split(":");
    const [left, right] = numbers.trim().split(" | ");
    const count = countMatches(left, right);

    for (let index = 1; index <= count; index++) {
      const cardCopy = cardOrder + index;
      const previousCopies = duplicates.get(cardCopy) ?? 0;
      duplicates.set(cardCopy, previousCopies + (1 + cardDuplicates));
    }
  });
  console.log(total);
};

main();
