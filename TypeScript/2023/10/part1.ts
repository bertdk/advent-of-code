import { readFileSync } from "fs";
import { join } from "path";

enum Tiles {
  Vertical = "|",
  Horizontal = "-",
  TurnNE = "L",
  TurnNW = "J",
  TurnSW = "7",
  TurnSE = "F",
  Ground = ".",
  Start = "S",
}

type Grid = string[][];
type Position = [number, number] | number[];

const findStart = (grid: Grid) => {
  return grid.reduce<Position>(
    (p, row, rowIndex) => {
      const colIndex = row.findIndex((x) => x === Tiles.Start);
      if (colIndex >= 0) return [rowIndex, colIndex];
      return p;
    },
    [0, 0]
  );
};

const isValidStep = (
  from: { pos: Position; tile: Tiles },
  to: { pos: Position; tile: Tiles }
) => {
  const isStepRight =
    from.pos[1] + 1 === to.pos[1] && from.pos[0] === to.pos[0];
  const isStepLeft = from.pos[1] - 1 === to.pos[1] && from.pos[0] === to.pos[0];
  const isStepUp = from.pos[0] - 1 === to.pos[0] && from.pos[1] === to.pos[1];
  const isStepDown = from.pos[0] + 1 === to.pos[0] && from.pos[1] === to.pos[1];
  let goodConnections: Tiles[] = [];
  const tilesToGoRight = [Tiles.TurnNW, Tiles.TurnSW, Tiles.Horizontal];
  const tilesToGoLeft = [Tiles.TurnNE, Tiles.TurnSE, Tiles.Horizontal];
  const tilesToGoUp = [Tiles.TurnSE, Tiles.TurnSW, Tiles.Vertical];
  const tilesToGoDown = [Tiles.TurnNE, Tiles.TurnNW, Tiles.Vertical];
  switch (from.tile) {
    case Tiles.Horizontal:
      if (isStepRight || isStepLeft)
        goodConnections = isStepRight ? tilesToGoRight : tilesToGoLeft;
      break;
    case Tiles.Vertical:
      if (isStepUp || isStepDown)
        goodConnections = isStepUp ? tilesToGoUp : tilesToGoDown;
      break;
    case Tiles.TurnNE:
      if (isStepUp || isStepRight)
        goodConnections = isStepUp ? tilesToGoUp : tilesToGoRight;
      break;
    case Tiles.TurnNW:
      if (isStepUp || isStepLeft)
        goodConnections = isStepUp ? tilesToGoUp : tilesToGoLeft;
      break;
    case Tiles.TurnSW:
      if (isStepDown || isStepLeft)
        goodConnections = isStepDown ? tilesToGoDown : tilesToGoLeft;
      break;
    case Tiles.TurnSE:
      if (isStepDown || isStepRight)
        goodConnections = isStepDown ? tilesToGoDown : tilesToGoRight;
      break;
    case Tiles.Start:
      goodConnections = isStepUp
        ? tilesToGoUp
        : isStepDown
        ? tilesToGoDown
        : isStepRight
        ? tilesToGoRight
        : tilesToGoLeft;
      break;
    default:
      goodConnections = [];
  }
  // console.log({ from: from.tile, to: to.tile, goodConnections });
  return goodConnections.includes(to.tile);
};

const getTile = (grid: Grid, pos: Position) => {
  return grid[pos[0]][pos[1]] as Tiles;
};

const findNext = (grid: Grid, positions: Position[], visited: Position[]) => {
  const maxValues = [grid.length, grid[0].length];

  const next = positions.flatMap((p) => {
    const options = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
      .map((c) => c.map((x, i) => p[i] + x))
      .filter((c) => c.every((x, i) => x >= 0 && x < maxValues[i]))
      .filter((c) => {
        const isVisited = visited.some((x) => x.every((v, i) => v === c[i]));
        const isValid = isValidStep(
          { pos: p, tile: getTile(grid, p) },
          { pos: c, tile: getTile(grid, c) }
        );
        return !isVisited && isValid;
      });
    return options;
  });

  return next;
};

const main = () => {
  const path = join(__dirname, "input.txt");
  const file = readFileSync(path);
  const lines = file.toString().split("\n");
  const grid = lines.map((l) => {
    return l.split("");
  });

  let pos = [findStart(grid)];
  const visited = [...pos];
  let steps = 0;
  while (pos.length) {
    // console.log({ pos });
    pos = findNext(grid, pos, visited);
    visited.push(...pos);
    steps++;
  }
  console.log(steps - 1);
};

main();
