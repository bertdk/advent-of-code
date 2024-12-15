import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const robots = readFileSync(path).toString().trim().split("\n");

  const wide = 101;
  const tall = 103;

  const regex = /(p=)(?<p1>\d*),(?<p2>\d*)( v=)(?<v1>-?\d*),(?<v2>-?\d*)/;
  const robotInput = robots.map((robot) => {
    const r = regex.exec(robot);
    if (!r || !r.groups) return [];

    const { p1, p2, v1, v2 } = r.groups;
    return [p1, p2, v1, v2].map((x) => Number(x));
  });

  let seconds = 0;
  let isTree = false;
  let globalBoard: (string | number)[][] = [];
  while (!isTree) {
    const grid = robotInput.map((robot) => {
      const [px, py, vx, vy] = robot;
      let [runningX, runningY] = [px + vx * seconds, py + vy * seconds];
      while (runningX >= wide) {
        runningX -= wide;
      }
      while (runningX < 0) {
        runningX += wide;
      }
      while (runningY >= tall) {
        runningY -= tall;
      }
      while (runningY < 0) {
        runningY += tall;
      }

      return [runningX, runningY].join("-");
    });

    const board = [];
    for (let i = 0; i < tall; i++) {
      const row = [];
      for (let col = 0; col < wide; col++) {
        const curr = [col, i].join("-");
        const count = grid.filter((x) => x == curr);

        row.push(count.length > 0 ? count.length : ".");
      }
      board.push(row);
    }
    globalBoard = board;

    Math.floor(wide / 2);
    isTree = board.reduce((prev, row) => {
      if (!prev) return prev;

      return row.every((x) => x == 1 || x == ".");
    }, true);

    // console.log("-----------")
    console.log({ seconds });
    seconds++;
  }
}

main();
