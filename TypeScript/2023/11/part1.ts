import { readFileSync } from "fs";
import { join } from "path";

type Position = [number, number];

function shouldCountDouble(from: Position, to: Position, r: number, x: 0 | 1) {
  return (r > from[x] && r < to[x]) || (r < from[x] && r > to[x]);
}

function main() {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");

  const gal = "#";

  let possibleDoubleCols: (number | null)[] = new Array(lines[0].length)
    .fill(null)
    .map((_, i) => i);
  const galPositions = lines.reduce<Position[]>((p, row, i) => {
    const columns = row.split("").reduce<number[]>((p, col, cI) => {
      return col === gal ? [...p, cI] : p;
    }, []);
    columns.forEach((c) => (possibleDoubleCols[c] = null));
    const positions = columns.map<Position>((c) => [i, c]);
    return [...p, ...positions];
  }, []);
  const doubleCols = possibleDoubleCols.filter((x) => x != null) as number[];

  const doubleRows = lines.reduce<number[]>(
    (p, c, i) => (c.includes(gal) ? p : [...p, i]),
    []
  );
  // console.log({ doubleCols, doubleRows });

  const pairs = galPositions.flatMap((from, i) => {
    const pairWith = galPositions.slice(i + 1);
    const p = pairWith.map((to) => ({ from, to }));
    return p;
  });

  const shortestDistances = pairs.map<number>(({ from, to }, i) => {
    const y = Math.abs(from[0] - to[0]);
    const x = Math.abs(from[1] - to[1]);
    const distance = y + x;
    const countDoubleRows = doubleRows.reduce(
      (acc, r) => (shouldCountDouble(from, to, r, 0) ? acc + 1 : acc),
      0
    );
    const countDoubleCols = doubleCols.reduce(
      (acc, r) => (shouldCountDouble(from, to, r, 1) ? acc + 1 : acc),
      0
    );
    const realDistance = distance + countDoubleCols + countDoubleRows;
    // console.log(
    //   `[${i}] ${from} - ${to}: ${realDistance} = ${x} + ${y} + ${countDoubleRows} + ${countDoubleCols}`
    // );
    return realDistance;
  });
  const result = shortestDistances.reduce((p, x) => p + x, 0);
  console.log(result);
}

main();
