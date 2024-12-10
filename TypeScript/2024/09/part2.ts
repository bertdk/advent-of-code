import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const [inputString] = readFileSync(path).toString().split("\n");

  let rawResult: { id: number | null; length: number }[] = [];
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

  for (let file = pointer; file >= 0; file--) {
    const fileBlockToMoveIndex = rawResult.findIndex((x) => x.id == file);
    const fileBlockToMove = rawResult[fileBlockToMoveIndex]
    
    const fitEmpty = rawResult.slice(0, fileBlockToMoveIndex).findIndex(
      (x) => x.id == null && x.length >= fileBlockToMove.length
    );
    if (fitEmpty >= 0 && fileBlockToMoveIndex >= 0) {
      rawResult[fitEmpty].length -= fileBlockToMove.length;
      const moved = { length: fileBlockToMove.length, id: null}
      rawResult = [
        ...rawResult.slice(0, fitEmpty),
        fileBlockToMove,
        ...rawResult.slice(fitEmpty, fileBlockToMoveIndex),
        moved,
        ...rawResult.slice(fileBlockToMoveIndex + 1),
      ];
    }
  }
  const compacted: { id: number | null; length: number }[] = rawResult.filter(x => x.length > 0)

  const result = compacted.reduce(
    (p, c) => {
      for (let i = 0; i < c.length; i++) {
        if (c.id != null) {
          p.checksum += (i + p.index) * c.id;
        }
      }
      p.index += c.length;
      return p;
    },
    { index: 0, checksum: 0 }
  ).checksum;

  console.log({ result });
}

main();
