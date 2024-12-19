import { readFileSync } from "fs";
import { join } from "path";

function getPossibleCount(
  design: string,
  towels: string[],
  cache: { [k: string]: number } = {}
): { possible: number; cache: { [k: string]: number } } {
  if (Object.keys(cache).includes(design)) {
    return { possible: cache[design], cache };
  }

  const possible = towels
    .filter((towel) => design.startsWith(towel))
    .reduce((p, towel) => {
      if (design == towel) {
        return p + 1;
      }
      const newPossible = getPossibleCount(
        design.slice(towel.length),
        towels,
        cache
      ).possible;
      return p + newPossible;
    }, 0);

  cache[design] = possible;
  return { possible, cache };
}

function main() {
  const path = join(__dirname, "input.txt");
  const [towelsRaw, designsRaw] = readFileSync(path)
    .toString()
    .trim()
    .split("\n\n");

  const towels = towelsRaw.split(", ");
  const designs = designsRaw.split("\n");

  const result = designs.reduce((count, design) => {
    const options = getPossibleCount(design, towels);
    return count + options.possible;
  }, 0);

  console.log({ result });
}

main();
