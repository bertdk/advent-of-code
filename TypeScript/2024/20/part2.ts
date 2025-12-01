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
    result += rowSplit.reduce((count, v) => (v == "." ? count + 1 : count), 0);
    return rowSplit;
  });

  const maxCheat = 20;
  const goodLimit = 52;
  let goodCheat = 0;
  const cheats: { [k: number]: number } = {};

  const walkingPath = aStar(maze, start, end)?.path ?? [];

  for (
    let currentIndex = 0;
    currentIndex < walkingPath.length;
    currentIndex++
  ) {
    const current = walkingPath[currentIndex];
    const options: { end: number[]; requiredSteps: number }[] = [];
    for (let row = current[1] - maxCheat; row < current[1] + maxCheat; row++) {
      if (row < 0 || row >= maze.length) continue;

      const limit = maxCheat - Math.abs(row);
      for (let col = current[0] - limit; col < current[0] + limit; col++) {
        if (
          col < 0 ||
          col >= maze[0].length ||
          !walkingPath
            .slice(currentIndex + 1)
            .some((loc) => loc[0] == col && loc[1] == row)
        ) {
          continue;
        }

        options.push({
          end: [col, row],
          requiredSteps: Math.abs(
            Math.abs(row) - current[1] + Math.abs(col) - current[0]
          ),
        });
      }
    }
    for (const option of options) {
      const cheatResult = aStar(maze, current, option.end);
      if (!cheatResult) continue;

      if (
        cheatResult.path &&
        cheatResult.cost - option.requiredSteps == goodLimit
      ) {
        goodCheat++;
        console.log({
          end: option.end,
          current,
        });
        cheats[cheatResult.cost - option.requiredSteps] =
          (cheats[cheatResult.cost - option.requiredSteps] ?? 0) + 1;
      }
    }
  }

  console.log(cheats);
}

main();
