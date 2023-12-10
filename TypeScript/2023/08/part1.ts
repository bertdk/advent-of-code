import { readFileSync } from "fs";
import { join } from "path";

const formatLine = (line: string) => {
  return line.match(/(?<node>\w*) = \((?<L>\w*), (?<R>\w*)\)/)?.groups;
};

const main = (final: string) => {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");

  const nodes = lines.map((x) => {
    const node = formatLine(x)?.node;
    return node;
  });
  let currentNode = "AAA";
  let steps = 0;

  while (currentNode != final) {
    const currentTurn = lines[0].charAt(steps % lines[0].length);
    const line = lines[nodes.indexOf(currentNode)];

    currentNode = formatLine(line)?.[currentTurn]!;
    steps++;
    // console.log(`Step ${steps} go ${currentTurn} to ${currentNode}`);
  }

  console.log(steps);
};

main("ZZZ");
