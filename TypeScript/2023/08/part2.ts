import { readFileSync } from "fs";
import { join } from "path";

const formatLine = (line: string) => {
  return line.match(/(?<node>\w*) = \((?<L>\w*), (?<R>\w*)\)/)?.groups;
};

const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
const lcm = (...n: number[]) => n.reduce((x, y) => (x * y) / gcd(x, y));

const main = (final: string) => {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");

  const nodes = lines.reduce<{ [node: string]: { L: string; R: string } }>(
    (p, x) => {
      const groups = formatLine(x);
      return groups ? { ...p, [groups.node]: { L: groups.L, R: groups.R } } : p;
    },
    {}
  );
  let currentNodes = Object.keys(nodes)
    .filter((x) => x.endsWith("A"))
    .map((x) => ({ node: x, foundFinal: false, steps: 0 }));
  let steps = 0;

  while (currentNodes.some((x) => !x.foundFinal)) {
    const currentTurn = lines[0].charAt(steps % lines[0].length) as "L" | "R";

    steps++;
    // console.log(`Step ${steps}`);

    currentNodes = currentNodes.map((n) => {
      const node = nodes[n.node][currentTurn];
      const foundFinal = node.endsWith(final);
      // console.log(`\t- ${n.node} -> ${node}`);
      return {
        node,
        foundFinal: n.foundFinal || foundFinal,
        steps: n.foundFinal ? n.steps : foundFinal ? steps : 0,
      };
    });
    // if (steps % 1000000 === 0) console.log(`Step ${steps}`);
  }

  const result = lcm(...currentNodes.map((x) => x.steps));

  console.log(steps);
  console.log(result);
};

main("Z");
