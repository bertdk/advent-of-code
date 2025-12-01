import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const [inputString] = readFileSync(path).toString().split("\n");
  let stones = inputString.split(" ");

}

main();
