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

const findNextClosingTile = (rowTiles: Tiles[], currentIndex: number) => {
  const closers = [Tiles.TurnNW, Tiles.TurnSW];
  return rowTiles.slice(currentIndex + 1).reduce<{ i: number; tile?: Tiles }>(
    (p, c, i) => {
      if (!p.tile && closers.includes(c))
        return { i: currentIndex + i + 1, tile: c };
      return p;
    },
    { i: currentIndex, tile: undefined }
  );
};

const main = (fileInput: string) => {
  const path = join(__dirname, fileInput);
  const file = readFileSync(path);
  const lines = file.toString().split("\n");
  const grid = lines.map((l) => {
    return l.split("");
  });

  let pos = [findStart(grid)];
  const visited = [...pos];
  let steps = 0;
  while (pos.length) {
    pos = findNext(grid, pos, visited);
    visited.push(...pos);
    steps++;
  }

  let result = 0;
  grid.map((row, r) => {
    let i = 0;
    let isOpen = false;
    const rowTiles = row as Tiles[];
    const openers = [Tiles.TurnNE, Tiles.TurnSE];

    while (i < row.length) {
      const hasVisited = visited.some((x) => x[0] === r && x[1] === i);
      let isJump = false;
      const tile = row[i] as Tiles;
      // console.log(`${tile} at (${r}, ${i}): from${isOpen ? "" : " not"} open`);
      if (!hasVisited) {
        if (isOpen) result++;
      } else if (hasVisited && tile === Tiles.Vertical) {
        isOpen = !isOpen;
      } else if (hasVisited && openers.includes(tile)) {
        const next = findNextClosingTile(rowTiles, i);
        if (next.tile) {
          isJump = true;
          i = next.i;
          if (tile === Tiles.TurnNE) {
            isOpen = next.tile === Tiles.TurnNW ? isOpen : !isOpen;
          } else {
            isOpen = next.tile === Tiles.TurnSW ? isOpen : !isOpen;
          }
        }
      }
      // console.log(`-> to ${isOpen ? "" : "not"} open`);

      i++;
    }
  });

  return result;
};

const input: { file: string; solution?: number }[] = [
  // {
  //   file: "sample5.txt",
  //   solution: 4,
  // },
  // {
  //   file: "sample6.txt",
  //   solution: 4,
  // },
  // {
  //   file: "sample7.txt",
  //   solution: 8,
  // },
  // {
  //   file: "sample8.txt",
  //   solution: 10,
  // },
  {
    file: "input.txt",
  },
];
input.forEach((element) => {
  const solution = main(element.file);
  console.log(`File ${element.file}: ${solution}`);
  if (element.solution && solution != element.solution) {
    console.log(`!! Solution should have been ${element.solution} !!`);
  }
  console.log();
});
