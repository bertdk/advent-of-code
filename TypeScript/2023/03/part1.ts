import * as fs from "fs";
import path from "path";

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");

  let result = 0;
  lines.map((line, i) => {
    const above = i > 0 ? lines[i - 1] : "";
    const below = i < lines.length - 1 ? lines[i + 1] : "";
    const n = line
      .split("")
      .reduce<{ number: string; i: number }[]>(
        (p, c, i) => {
          const prevLast = p[p.length - 1];
          if ("1234567890".includes(c)) {
            prevLast.number += c;
            prevLast.i = prevLast.i === -1 ? i : prevLast.i;
          } else if (prevLast.number !== "") {
            p.push({ number: "", i: -1 });
          }

          return p;
        },
        [{ number: "", i: -1 }]
      )
      .filter((n) => n.number !== "")
      .filter((x) => {
        const neighbors = [];
        if (x.i > 0) neighbors.push(line[x.i - 1]);
        if (x.i + x.number.length < line.length)
          neighbors.push(line[x.i + x.number.length]);
        const subFrom = x.i > 0 ? x.i - 1 : 0;
        const subUntil = x.i + x.number.length + 1;
        const aboveSub = above.substring(subFrom, subUntil);
        const belowSub = below.substring(subFrom, subUntil);
        neighbors.push(aboveSub);
        neighbors.push(belowSub);

        return neighbors
          .join("")
          .split("")
          .some((n) => n !== ".");
      })
      .map((n) => Number(n.number));
    result += n.reduce((p, c) => p + c, 0);
  });
  console.log(result);
};

main();
