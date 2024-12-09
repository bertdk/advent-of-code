import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const inputString = readFileSync(path).toString();
  const input = inputString.split("\n").filter((x) => x.length > 0);
  const rows = input.length;
  const cols = input[0].length;

  const antennas = input.reduce<{ [k: string]: number[][] }>(
    (p, row, rowIndex) => {
      return row.split("").reduce((pr, char, colIndex) => {
        if (char != ".") pr[char] = [...(pr[char] ?? []), [rowIndex, colIndex]];
        return pr;
      }, p);
    },
    {}
  );

  const total = Object.values(antennas).reduce((p, antenna) => {
    const result = antenna.flatMap((a, i) => {
      const other = antenna.slice(i + 1);
      return other.flatMap((o) => {
        const x = a[0] - o[0];
        const y = a[1] - o[1];
        return [
          [a[0] + x, a[1] + y],
          [o[0] - x, o[1] - y],
        ]
          .filter(
            (pos) =>
              pos[0] >= 0 && pos[1] >= 0 && pos[0] < rows && pos[1] < cols
          )
          .map((v) => v.join("-"));
      });
    });
    result.forEach((x) => p.add(x));
    return p;
  }, new Set<string>());

  const board = input
    .map((x, row) => {
      return x
        .split("")
        .map((c, col) => {
          if (total.has([row, col].join("-"))) {
            return "#";
          }
          return c;
        })
        .join("");
    })
    .join("\n");
  console.log(board);
  console.log(total.size)
}

main();

// Too low: 394