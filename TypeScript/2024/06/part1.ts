import { Dir, readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");

  let guardPos: number[] = [];
  const board = readFileSync(path)
    .toString()
    .split("\n")
    .filter((x, row) => {
      const guardColumn = x.indexOf("^");
      if (guardColumn >= 0) {
        guardPos.push(row, guardColumn);
      }
      return x.length > 0;
    })
    .map((x) => x.split(""));

  let isNextStepPossible = true;
  let nextDirection = Direction.UP;
  while (isNextStepPossible) {
    const next = getNextLocation(nextDirection, guardPos);
    isNextStepPossible =
      next[0] >= 0 &&
      next[1] >= 0 &&
      next[0] < board.length &&
      next[1] < board[0].length;

    if (isNextStepPossible) {
      board[guardPos[0]][guardPos[1]] = "X";
      const newLocation = board[next[0]][next[1]];
      if (newLocation == "#") {
        switch (nextDirection) {
          case Direction.UP:
            nextDirection = Direction.RIGHT;
            break;
          case Direction.RIGHT:
            nextDirection = Direction.DOWN;
            break;
          case Direction.LEFT:
            nextDirection = Direction.UP;
            break;
          case Direction.DOWN:
            nextDirection = Direction.LEFT;
            break;
        }
      } else {
          guardPos = next;
      }
    }
  }

  const result = board.reduce(
    (p, row) => p + row.reduce((count, c) => (c == "X" ? count + 1 : count), 0),
    1
  );
  console.log({result});
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

function getNextLocation(direction: Direction, currentPosition: number[]) {
  switch (direction) {
    case Direction.UP:
      return [currentPosition[0] - 1, currentPosition[1]];
    case Direction.DOWN:
      return [currentPosition[0] + 1, currentPosition[1]];
    case Direction.LEFT:
      return [currentPosition[0], currentPosition[1] - 1];
    case Direction.RIGHT:
      return [currentPosition[0], currentPosition[1] + 1];

    default:
      return currentPosition;
  }
}

main();
