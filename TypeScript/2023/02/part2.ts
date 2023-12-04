import * as fs from "fs";
import path from "path";

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");

  const colors = ["red", "green", "blue"];
  let result = 0;
  lines.map((line) => {
    const gameId = line.match(/Game (\d+)/)?.[1];
    if (!gameId) return;

    const max = colors.reduce<{ [color: string]: number }>(
      (p, color) => {
        if (!p) return p;
        const matches = line
          .match(new RegExp(`(\\d*) ${color}`, "g"))
          ?.map((match) =>
            Number(match.substring(0, match.length - color.length - 1))
          );

        if (!matches) return p;

        const max = Math.max(...matches);
        return { ...p, [color]: max };
      },
      colors.reduce<{ [color: string]: number }>(
        (p, color) => ({ ...p, [color]: 0 }),
        {}
      )
    );

    result += Object.values(max).reduce((p, c) => p * c, 1);
  });
  console.log(result);
};

main();
