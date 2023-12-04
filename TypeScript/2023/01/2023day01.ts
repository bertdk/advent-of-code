import * as fs from "fs";
import path from "path";

const main = async () => {
  const filePath = path.join(__dirname, "input.txt");

  const file = fs.readFileSync(filePath);
  const lines = file.toString().split("\n");
  const numbers = lines.map((c) => {
    const list = c.split("");
    const first = list.reduce<number | null>((p, c) => {
      if (p != null) return p;
      if (Number.isNaN(Number(c))) return null;
      return Number(c);
    }, null);
    const second = list.reverse().reduce<number | null>((p, c) => {
      if (p != null) return p;
      if (Number.isNaN(Number(c))) return null;
      return Number(c);
    }, null);
    return first! * 10 + second!;
  });
  const result = numbers.reduce((p, c) => p + c, 0);
  console.log(result);
};

main();
