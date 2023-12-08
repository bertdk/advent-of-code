import * as fs from "fs";
import path from "path";

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");
  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");

  let result = 0;
  lines.map((line, i) => {
    const matches = line.match(
      /(Card *\d*:) (?<winning>[\d ]*) (\|) (?<have>[\d ]*)/
    )?.groups;

    const winning = matches?.winning.split(" ").filter((x) => x && x !== " ");
    const have = matches?.have.split(" ").filter((x) => x && x !== " ");

    const count =
      have?.reduce((p, c) => (winning?.includes(c) ? 1 + p : p), 0) ?? 0;

    result += count > 0 ? Math.pow(2, count - 1) : 0;
  });
  console.log(result);
};

main();
