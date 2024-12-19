import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const [towelsRaw, designsRaw] = readFileSync(path)
    .toString()
    .trim()
    .split("\n\n");

  const towels = towelsRaw.split(", ");

  const designs = designsRaw.split("\n");

  const result = designs.reduce((count, design) => {
    let isPossible = false;
    let options = towels;
    console.log({ count, design });

    while (options.length > 0 && !isPossible) {
      options = [
        ...new Set(
          options.flatMap((o) => {
            const currentTowel = o;
            const nextNodes: string[] = [];
            for (const towel of towels) {
              const newTowel = currentTowel + towel;
              const designPart = design.slice(0, newTowel.length);
              if (newTowel == designPart) {
                nextNodes.push(newTowel);
              }
            }
            return nextNodes;
          })
        ),
      ];

      isPossible = options.includes(design);
    }

    return isPossible ? count + 1 : count;
  }, 0);

  console.log({ result });
}

main();
