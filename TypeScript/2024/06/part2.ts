import { readFileSync } from "fs";
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
  let guardDirection = Direction.UP;

  const objectPositions = [];
  const ignoreList: string[] = [];

  while (isNextStepPossible) {
    const next = getNextPos(guardPos, guardDirection);
    isNextStepPossible =
      next[0] >= 0 &&
      next[1] >= 0 &&
      next[0] < board.length &&
      next[1] < board[0].length;

    if (!isNextStepPossible) {
      continue;
    }

    const currentLocation = board[guardPos[0]][guardPos[1]];
    const nextIcon =
      currentLocation == "|" || currentLocation == "-"
        ? "+"
        : guardDirection == Direction.UP || guardDirection == Direction.DOWN
        ? "|"
        : "-";
    board[guardPos[0]][guardPos[1]] = nextIcon;

    const newLocation = board[next[0]][next[1]];
    if (newLocation == "#") {
      guardDirection = getNextDirection(guardDirection);
    } else if (ignoreList.includes(next.join("-"))) {
      guardPos = next;
    } else {
      let rightRoad = getRightRoad(board, guardPos, guardDirection);
      let block = rightRoad.indexOf("#");
      if (block >= 0) {
        board[next[0]][next[1]] = "#";
      }

      let isCircle = false;
      let loopDirection = guardDirection;
      let loopPos = guardPos;
      const visited = [];
      while (block >= 0 && !isCircle) {
        visited.push(loopPos.join("-"));

        loopDirection = getNextDirection(loopDirection);
        loopPos = getNextPos(loopPos, loopDirection, block);
        rightRoad = getRightRoad(board, loopPos, loopDirection);
        block = rightRoad.indexOf("#");

        isCircle =
          visited.reduce(
            (p, v, i, a) => (a.slice(i + 1).includes(v) ? p + 1 : p),
            0
          ) > 2;
      }
      if (isCircle) {
        objectPositions.push({ next, visited });
      }
      if (isCircle == false) {
        ignoreList.push(next.join("-"));
      }

      guardPos = next;
      board[next[0]][next[1]] = newLocation;
    }
  }

  const result = objectPositions.reduce<{ [key: number]: number[] }>(
    (p, c) => ({
      ...p,
      [c.next[0]]: [...new Set([...(p[c.next[0]] ?? []), c.next[1]])],
    }),
    {}
  );
  console.log(
    Object.keys(result).reduce((p, r) => p + result[Number(r)].length, 0)
  );
}

function getNextDirection(direction: Direction) {
  switch (direction) {
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.LEFT:
      return Direction.UP;
  }
}

function getNextPos(
  position: number[],
  direction: Direction,
  stepsToBlock: number = 1
): number[] {
  switch (direction) {
    case Direction.UP:
      return [position[0] - stepsToBlock, position[1]];
    case Direction.DOWN:
      return [position[0] + stepsToBlock, position[1]];
    case Direction.RIGHT:
      return [position[0], position[1] + stepsToBlock];
    case Direction.LEFT:
      return [position[0], position[1] - stepsToBlock];
  }
}

function getRightRoad(
  board: string[][],
  position: number[],
  direction: Direction
) {
  let rightSteps = [];
  switch (direction) {
    case Direction.UP:
      rightSteps = board[position[0]].slice(position[1] + 1);
      break;
    case Direction.DOWN:
      rightSteps = board[position[0]].slice(0, position[1]).reverse();
      break;
    case Direction.RIGHT:
      for (let row = position[0] + 1; row < board.length; row++) {
        rightSteps.push(board[row][position[1]]);
      }
      break;
    case Direction.LEFT:
      for (let row = position[0] - 1; row >= 0; row--) {
        rightSteps.push(board[row][position[1]]);
      }
      break;
  }
  return rightSteps.join("");
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

main();
