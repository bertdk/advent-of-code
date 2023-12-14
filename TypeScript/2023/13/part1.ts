import { readFileSync } from "fs";
import { join } from "path";

function findMirror(lines: string[]) {
  for (let index = 0; index < lines.length - 1; index++) {
    let isMirror = true;
    let diff = 0;
    while (diff <= index && isMirror) {
      const current = lines[index - diff];
      const next = lines[index + 1 + diff];
      if (current && next) isMirror = current === next;
      diff++;
    }

    if (isMirror) {
      return index + 1;
    }
  }

  return null;
}

function main() {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const patterns = file.toString().split("\n\n");

  let rows = 0;
  let columns = 0;

  patterns.forEach((pattern) => {
    const lines = pattern.split("\n").filter((x) => x && x != "");
    const mirrorX = findMirror(lines);
    if (mirrorX) rows += mirrorX;

    const transposed = lines[0]
      .split("")
      .map((_, col) => lines.map((row) => row[col]).join());
    const mirrorY = findMirror(transposed);
    if (mirrorY) columns += mirrorY;

    if (mirrorX && mirrorY) console.log({ mirrorX, mirrorY });
  });

  const result = columns + 100 * rows;
  console.log(result);
}

main();
