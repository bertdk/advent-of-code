import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const [inputString] = readFileSync(path).toString().split("\n");
  const stones = inputString.split(" ");

  const result = stones.reduce((p, c) => {
    let currentStones = [c];
    for (let index = 0; index < 75; index++) {
      currentStones = currentStones
        .flatMap((stone) => {
          if (stone == "0") {
            return 1;
          }

          if (stone.length % 2 == 0) {
            const mid = stone.length / 2;
            return [stone.slice(0, mid), stone.slice(mid)].map((x) =>
              Number(x)
            );
          }

          return Number(stone) * 2024;
        })
        .map((x) => String(x));
        console.log({currentStones, index})
    }

    return p + currentStones.length;
  }, 0);

  console.log({ result });
}

main();
