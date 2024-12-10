import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const [inputString] = readFileSync(path).toString().split("\n");

  const rawResult = [];
  let pointer = 0;
  for (let index = 0; index < inputString.length; index += 2) {
    const fileId = index / 2;
    const fileLength = Number(inputString[index]);
    const freeLength = Number(inputString[index + 1]);

    rawResult.push({ length: fileLength, id: fileId });
    if (!Number.isNaN(freeLength)) {
      rawResult.push({ length: freeLength, id: null });
    }

    pointer = fileId;
  }

  const compacted = [];
  for (let index = 1; index < rawResult.length; index += 2) {
    compacted.push(rawResult[index - 1]);
    const toFill = rawResult[index].length;
    for (let i = 1; i <= toFill; i++) {
      let rawFind = rawResult
        .slice(index + 1)
        .findIndex((x) => x.id == pointer);
      let rawIndex = rawFind + index + 1;
      if (rawResult[rawIndex].length == 0) {
        pointer--;
        rawFind = rawResult.slice(index + 1).findIndex((x) => x.id == pointer);
        rawIndex = rawFind + index + 1;
      }
      if (rawFind < 0) continue;
      rawResult[rawIndex].length--;
      compacted.push({ length: 1, id: pointer });
    }
  }

  const result = compacted.reduce(
    (p, c) => {
      for (let i = 0; i < c.length; i++) {
        if (c.id != null) {
          p.checksum += (i + p.index) * c.id;
        }
      }
      p.index += c.length
      return p;
    },
    { index: 0, checksum: 0 }
  ).checksum;

  console.log({ result });
}

main();
