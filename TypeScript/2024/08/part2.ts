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

        const nodes = [];
        let newPlus = [a[0] + x, a[1] + y];
        while (newPlus[0] >= 0 && newPlus[1] >= 0 && newPlus[0] < rows && newPlus[1] < cols) {
          nodes.push(newPlus);
          newPlus = [newPlus[0] + x, newPlus[1] + y];
        }

        let newMin = [o[0] - x, o[1] - y];
        while (newMin[0] >= 0 && newMin[1] >= 0 && newMin[0] < rows && newMin[1] < cols) {
          nodes.push(newMin);
          newMin = [newMin[0] - x, newMin[1] - y];
        }

        return nodes.map((v) => v.join("-"));
      });
    });
    result.forEach((x) => p.add(x));
    if(antenna.length > 1){
      antenna.forEach((x) => p.add(x.join("-")));
    }
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
  console.log(total.size);
}

main();

// Too low: 394
