import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const robots = readFileSync(path).toString().trim().split("\n");

  const wide = 101;
  const tall = 103;
  const seconds = 100;

  const regex = /(p=)(?<p1>\d*),(?<p2>\d*)( v=)(?<v1>-?\d*),(?<v2>-?\d*)/;
  const quadrands = [
    {
      leftUp: [0, 0],
      rightDown: [Math.floor(wide / 2) - 1, Math.floor(tall / 2) - 1],
      count: 0,
    },
    {
      leftUp: [0, Math.ceil(tall / 2)],
      rightDown: [Math.floor(wide / 2) - 1, tall - 1],
      count: 0,
    },
    {
      leftUp: [Math.ceil(wide / 2), 0],
      rightDown: [wide - 1, Math.floor(tall / 2) - 1],
      count: 0,
    },
    {
      leftUp: [Math.ceil(wide / 2), Math.ceil(tall / 2)],
      rightDown: [wide - 1, tall - 1],
      count: 0,
    },
  ];
  const grid = robots.map((robot) => {
    const r = regex.exec(robot);
    if (!r || !r.groups) return;

    const { p1, p2, v1, v2 } = r.groups;
    const [px, py, vx, vy] = [p1, p2, v1, v2].map((x) => Number(x));

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

    quadrands.forEach((quad) => {
      if (
        runningX >= quad.leftUp[0] &&
        runningX <= quad.rightDown[0] &&
        runningY >= quad.leftUp[1] &&
        runningY <= quad.rightDown[1]
      ) {
        quad.count++;
      }
    });
    return [runningX, runningY].join("-");
  });

  const safety = quadrands.reduce((p, c) => p * c.count, 1);
  console.log({ safety });
}

main();
