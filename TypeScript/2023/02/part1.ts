import * as fs from "fs";
import path from "path";

const main = async (maxCubesPerColor: { [color: string]: number }) => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");

  const colors = Object.keys(maxCubesPerColor);
  let result = 0;
  lines.map((line) => {
    const gameId = line.match(/Game (\d+)/)?.[1];
    if (!gameId) return;

    const isPossible = colors.reduce((p, color) => {
      if (!p) return p;
      const matches = line
        .match(new RegExp(`(\\d*) ${color}`, "g"))
        ?.map((match) =>
          Number(match.substring(0, match.length - color.length - 1))
        );

      if (!matches) return p;
      const max = Math.max(...matches);
      return max <= maxCubesPerColor[color];
    }, true);

    if (!isPossible) return;

    result += Number(gameId);
  });
  console.log(result);
};

main({ red: 12, green: 13, blue: 14 });
