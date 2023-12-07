import * as fs from "fs";
import path from "path";

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");

  const gridGears: { [key: string]: number[] } = {};
  lines.map((line, lineIndex) => {
    const above = lineIndex > 0 ? lines[lineIndex - 1] : "";
    const below = lineIndex < lines.length - 1 ? lines[lineIndex + 1] : "";
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
      .map((x) => {
        const gears = [];

        if (x.i > 0 && line[x.i - 1] === "*")
          gears.push(`${lineIndex}-${x.i - 1}`);
        if (
          x.i + x.number.length < line.length &&
          line[x.i + x.number.length] === "*"
        )
          gears.push(`${lineIndex}-${x.i + x.number.length}`);
        const subFrom = x.i > 0 ? x.i - 1 : 0;
        const subUntil = x.i + x.number.length + 1;
        above
          .substring(subFrom, subUntil)
          .split("")
          .forEach((c, i) => {
            if (c === "*") gears.push(`${lineIndex - 1}-${subFrom + i}`);
          });
        below
          .substring(subFrom, subUntil)
          .split("")
          .forEach((c, i) => {
            if (c === "*") gears.push(`${lineIndex + 1}-${subFrom + i}`);
          });

        gears.forEach(
          (g) => (gridGears[g] = [...(gridGears[g] || []), Number(x.number)])
        );

        return { number: Number(x.number), gears };
      })
      .filter((x) => x.gears.length > 0);
  });

  const result = Object.values(gridGears)
    .filter((x) => x.length === 2)
    .reduce((p, c) => p + c[0] * c[1], 0);
  console.log(result);
};

main();
