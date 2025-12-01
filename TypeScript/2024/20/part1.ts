import { readFileSync } from "fs";
import { join } from "path";

const showMaze = (maze: string[][]) =>
  console.log(maze.map((x) => x.join("")).join("\n"));

const easyCost = (start: number[], end: number[]) =>
  start.reduce((p, s, i) => p + Math.abs(s - end[i]), 0);

const aStar = (maze: string[][], start: number[], end: number[]) => {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const width = maze[0].length;
  const height = maze.length;

  const froms = maze.map((row) => row.map<number[]>((_) => []));
  const costs = maze.map((row) => row.map<number>((_) => Infinity));
  costs[start[1]][start[0]] = 0;

  const open = [
    {
      location: start,
      easyCost: easyCost(start, end),
      correctCost: 0,
    },
  ];

  while (open.length > 0) {
    open.sort((a, b) => a.easyCost - b.easyCost);
    const current = open.shift();

    if (!current) {
      return;
    }
    if (current.location.every((pos, index) => pos == end[index])) {
      const path: number[][] = [end];
      while (!path[0].every((n, i) => n == start[i])) {
        path.splice(0, 0, froms[path[0][1]][path[0][0]]);
      }
      return { cost: current.correctCost, path };
    }

    for (const direction of directions) {
      const nextLocation = current.location.map((x, i) => x + direction[i]);
      const nextIcon = maze[nextLocation[1]][nextLocation[0]];

      if (
        nextLocation.every((p) => p > 0) &&
        nextLocation[0] < height &&
        nextLocation[1] < width &&
        nextIcon != "#"
      ) {
        const correctCost = costs[current.location[1]][current.location[0]] + 1;
        if (correctCost < costs[nextLocation[1]][nextLocation[0]]) {
          open.push({
            location: nextLocation,
            easyCost: easyCost(nextLocation, end),
            correctCost,
          });
          froms[nextLocation[1]][nextLocation[0]] = current.location;
          costs[nextLocation[1]][nextLocation[0]] = correctCost;
        }
      }
    }
  }
};

function main() {
  const path = join(__dirname, "input.txt");
  const input = readFileSync(path).toString().trim().split("\n");
  let start: number[] = [];
  let end: number[] = [];

  let result = 0;
  const maze = input.map((row, i) => {
    const startCol = row.indexOf("S");
    if (startCol >= 0) {
      start = [startCol, i];
    }
    const endCol = row.indexOf("E");
    if (endCol >= 0) {
      end = [endCol, i];
    }

    const rowSplit = row.split("");
    result += rowSplit.reduce((count, v) => (v == "." || v == "S" ? count + 1 : count), 0);
    return rowSplit;
  });

  const goodLimit = 100;
  let goodCheat = 0;
  for (let row = 1; row < maze.length - 1; row++) {
    const fullRow = maze[row];
    for (let col = 1; col < fullRow.length - 1; col++) {
      const element = fullRow[col];
      if (element != "#") continue;

      let cheatResult;
      const singleHorizontal =
        fullRow[col - 1] != "#" && fullRow[col + 1] != "#";
      if (singleHorizontal) {
        cheatResult = aStar(maze, [col - 1, row], [col + 1, row]);
      }
      const singleVertical =
        maze[row - 1][col] != "#" && maze[row + 1][col] != "#";
      if (singleVertical) {
        cheatResult = aStar(maze, [col, row - 1], [col, row + 1]);
      }
      if (cheatResult && cheatResult.cost > goodLimit) {
        goodCheat++;
      }
    }
  }

  console.log(goodCheat);
}

main();
