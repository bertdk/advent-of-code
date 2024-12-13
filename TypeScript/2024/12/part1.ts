import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const garden = readFileSync(path)
    .toString()
    .split("\n")
    .filter((x) => x.length > 0)
    .map((x) => x.split(""));

  const regions: {
    letter: string;
    area: number;
    perimeter: number;
    tiles: string[];
  }[] = [];
  const open = garden.flatMap((row, r) => row.map((_, c) => [r, c]));
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  while (open.length > 0) {
    const current = open.splice(0, 1)[0];
    const currentRow = current[0];
    const currentCol = current[1];
    const letter = garden[currentRow][currentCol];

    const neightbours = directions
      .map((x) => [currentRow + x[0], currentCol + x[1]])
      .filter(
        (c) =>
          c[0] >= 0 &&
          c[0] < garden.length &&
          c[1] >= 0 &&
          c[1] < garden[0].length
      );
    const outside = directions.length - neightbours.length;

    const sameRegion = neightbours.filter((x) => garden[x[0]][x[1]] == letter);
    const border = neightbours.length - sameRegion.length;
    const newTiles = [...sameRegion, current].map((x) => x.join("-"));

    const regionIndex = regions.findIndex((r) =>
      r.tiles.reduce((p, c) => p || newTiles.includes(c), false)
    );

    const region =
      regionIndex >= 0
        ? regions.splice(regionIndex, 1)[0]
        : {
            perimeter: 0,
            area: 0,
            tiles: [current.join("-")],
          };

    const perimeter = region.perimeter + outside + border;
    const area = region.area + 1;
    const tiles = [...new Set([...region.tiles, ...newTiles])].sort();

    regions.push({ letter, area, perimeter, tiles });
    sameRegion.forEach((n) => {
      const i = open.findIndex((o) => o[0] == n[0] && o[1] == n[1]);
      if (i < 0) return;
      const [deleted] = open.splice(i, 1);
      open.splice(0, 0, deleted);
    });
  }

  const cost = regions.reduce((p, c) => p + c.area * c.perimeter, 0);
  console.log({ cost });
}

main();
