import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

enum Direction {
  Right,
  Left,
  Up,
  Down,
}

const getMove = (direction: Direction) => {
  switch (direction) {
    case Direction.Right:
      return [0, 1];
    case Direction.Left:
      return [0, -1];
    case Direction.Up:
      return [-1, 0];
    default:
      return [1, 0];
  }
};

type State = {
  position: number[];
  direction: Direction;
  score: number;
  path: number[][];
};

const getWeight = (maze: string[][], position: number[]) => {
  const tile = maze[position[0]][position[1]];
  return tile == "#" ? Infinity : 1;
};

const getFactor = (from: Direction, to: Direction) => {
  const vertical = [Direction.Down, Direction.Up];
  const horizontal = [Direction.Left, Direction.Right];
  if (
    (vertical.includes(from) && horizontal.includes(to)) ||
    (horizontal.includes(from) && vertical.includes(to))
  ) {
    return 1000;
  }
  return 0;
};

const showState = (states: State[], name: string) =>
  console.log({
    [name]: states.map((x) => ({
      ...x,
      position: x.position.join("-"),
      path: x.path.map((y) => y.join("-")).join(" "),
    })),
  });

const showMaze = (maze: string[][]) =>
  console.log(maze.map((x) => x.join("")).join("\n"));

function main() {
  const path = join(__dirname, "input.txt");
  const maze = readFileSync(path)
    .toString()
    .trim()
    .split("\n")
    .map((x) => x.split(""));

  const start = maze.reduce<number[] | null>((p, c, row) => {
    const col = c.indexOf("S");
    return col >= 0 ? [row, col] : p;
  }, null);
  const startDirection = Direction.Left;
  if (start == null) {
    return;
  }

  const open: State[] = [
    { position: start, direction: startDirection, score: 0, path: [start] },
  ];
  // const endings: State[] = [];
  let bestEnd: State | null = {score: 114476, position: start, direction: startDirection, path: []};

  while (open.length > 0) {
    // console.log({open: open.length})
    const [current] = open.splice(0, 1);

    // writeFileSync(
    //   join(__dirname, "output.txt"),
    //   maze
    //     .map((r, row) =>
    //       r
    //         .map((c, col) =>
    //           current.path
    //             .map((x) => x.join("-"))
    //             .includes([row, col].join("-"))
    //             ? "X"
    //             : c
    //         )
    //         .join("")
    //     )
    //     .join("\n")
    // );
    const options: State[] = [
      Direction.Up,
      Direction.Right,
      Direction.Left,
      Direction.Down,
    ]
      .map((d) => {
        const move = getMove(d);
        const newLocation = current.position.map((x, i) => x + move[i]);
        const weight = getWeight(maze, newLocation);
        const factor = getFactor(current.direction, d);

        return {
          position: newLocation,
          direction: d,
          score: current.score + weight + factor,
          path: [...current.path, newLocation],
        };
      })
      .filter(
        (x) =>
          x.score < Infinity && (bestEnd == null || x.score < bestEnd.score)
      )
      .filter((x) => {
        const isEnd = maze[x.position[0]][x.position[1]] == "E";
        if (isEnd) {
          if (bestEnd == null || bestEnd.score > x.score) {
            bestEnd = x;
          }
          console.log({
            bestEnd: bestEnd.score,
            steps: x.path.length,
            open: open.map((x) => x.score).join(" | "),
          });
        }
        return !isEnd;
      })
      .filter((x) => {
        const loop = x.path
          .slice(0, x.path.length - 1)
          .findIndex(
            (pos) => pos[0] == x.position[0] && pos[1] == x.position[1]
          );
        return loop < 0;
      });

    open.splice(0, 0, ...options);
  }

  // const bestScore = endings.reduce(
  //   (p, c) => (c.score < p ? c.score : p),
  //   Infinity
  // );
  if (bestEnd != null) {
    console.log((bestEnd as State).score);
  }
}

main();

// Too high: 531744
// Too high: 160588
// Too high: 148560
// 114476
