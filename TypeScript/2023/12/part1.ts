import { readFileSync } from "fs";
import { join } from "path";

function count(row: string, counts: number[]) {
  if (row.length === 0) {
    return counts.length === 0 ? 1 : 0;
  }
  if (counts.length === 0) {
    return row.includes("#") ? 0 : 1;
  }

  let result = 0;

  if (".?".includes(row.at(0)!)) {
    result += count(row.slice(1), counts);
  }

  if ("#?".includes(row.at(0)!)) {
    const isRowLongEnough = counts[0] <= row.length;
    const hasRowDot = row.slice(0, counts[0]).includes(".");
    const isRowExactLength = counts[0] === row.length;
    const isFullHashtag = row.at(counts[0]) != "#";
    if (isRowLongEnough && !hasRowDot && (isRowExactLength || isFullHashtag)) {
      result += count(row.slice(counts[0] + 1), counts.slice(1));
    }
  }
  return result;
}

function main() {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");

  const result = lines.reduce((p, line) => {
    const match = line.match(/(?<springs>[\#\.\?]*) (?<counts>[\d,]*)/);
    if (!match) return p;

    const row = match.groups!.springs;
    const counts = match.groups!.counts.split(",").map((x) => Number(x));

    const options = count(row, counts);

    return options + p;
  }, 0);

  console.log(result);
}

main();
