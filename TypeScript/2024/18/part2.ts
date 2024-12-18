import { readFileSync } from "fs";
import { join } from "path";

const showMaze = (maze: string[][]) =>
  console.log(maze.map((x) => x.join("")).join("\n"));

const calculateSimpleCost = (start: number[], end: number[]) =>
  end.reduce((cost, pos, i) => cost + Math.abs(pos - start[i]), 0);

const aStar = (maze: string[][], start: number[], end: number[]) => {
  const height = maze.length;
  const width = maze[0].length;

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const costs = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Infinity)
  );
  costs[start[1]][start[0]] = 0;
  const comeFrom: number[][][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => [])
  );
  const open = [{ pos: start, cost: calculateSimpleCost(start, end), g: 0 }];

  while (open.length > 0) {
    open.sort((a, b) => a.cost - b.cost);
    const current = open.shift();

    if (current == undefined) return;
    if (current.pos[0] == end[0] && current.pos[1] == end[1]) {
      return current.g;
    }

    for (const direction of directions) {
      const newPos = current.pos.map((p, i) => p + direction[i]);

      if (newPos[0] < width && newPos[1] < height && newPos[0] >= 0 && newPos[1] >= 0 && maze[newPos[1]][newPos[0]] == ".") {
        const newCost = costs[current.pos[1]][current.pos[0]] + 1;
        if (newCost < costs[newPos[1]][newPos[0]]) {
          costs[newPos[1]][newPos[0]] = newCost;
          comeFrom[newPos[1]][newPos[0]] = current.pos;

          open.push({pos: newPos, cost: newCost + calculateSimpleCost(newPos, end), g: newCost})
        }
      }
    }
  }

  return null;
};

function main() {
  const path = join(__dirname, "input.txt");
  let max = 1024;
  const width = 71;
  const height = 71;
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ".")
);
  const fileInput = readFileSync(path).toString().trim().split("\n");

  const input = fileInput.slice(0, max);

  input.forEach((byte) => {
    const [x, y] = byte.split(",").map(Number);
    maze[y][x] = "#";
  });

  const start = [0, 0];
  const end = [width - 1, height - 1]
  let result = aStar(maze, start, end)

  while(result){
    max++
    const newByte = fileInput[max - 1];
    console.log({newBlock: newByte})

    const [x, y] = newByte.split(",").map(Number);
    maze[y][x] = "#";

    result = aStar(maze, start, end)
  }
}

main();
