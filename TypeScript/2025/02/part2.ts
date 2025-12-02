import path from "path";
import fs from "fs";

function main() {
  const filePath = path.join(__dirname, "input.txt");

  const file = fs.readFileSync(filePath);
  const lines = file
    .toString()
    .split("\n")
    .filter((c) => c.length > 1);

  let result = 0;

  const isInvalid = (input: string) => {
    for (let size = 1; size <= Math.floor(input.length / 2); size++) {
      if (input.length % size != 0) continue;

      const segments = input.length / size;

      const isInvalid = input.slice(0, size).repeat(segments) === input
      if (isInvalid) {
        return true;
      }
    }
    return false;
  };
  for (const line of lines) {
    line.split(",").forEach((range) => {
      const [from, to] = range.split("-").map((x) => Number(x));
      for (let current = from; current <= to; current++) {
        if (isInvalid(current.toString())) {
          result += current;
        }
      }
    });
  }

  console.log(result);
}

main();
