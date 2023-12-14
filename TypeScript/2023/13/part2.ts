import { readFileSync } from "fs";
import { join } from "path";

function findMirror(lines: string[]) {
  for (let index = 0; index < lines.length - 1; index++) {
    let diff = 0;
    let smudges = 0;

    while (diff <= index && smudges <= 1) {
      const current = lines[index - diff];
      const next = lines[index + 1 + diff];
      if (current && next) {
        const currentSmudges = current
          .split("")
          .reduce((p, c, i) => (c === next.at(i) ? p : p + 1), 0);
        smudges += currentSmudges;
      }

      diff++;
    }

    if (smudges === 1) {
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

  for (let pattern of patterns) {
    const lines = pattern.split("\n").filter((x) => x && x != "");
    let mirrorX = findMirror(lines);

    const transposed = lines[0]
      .split("")
      .map((_, col) => lines.map((row) => row[col]).join(""));
    let mirrorY = findMirror(transposed);

    if (mirrorX != null) {
      rows += mirrorX;
    } else if (mirrorY != null) {
      columns += mirrorY;
    }
  }

  const result = columns + 100 * rows;
  console.log(result);
}

main();
