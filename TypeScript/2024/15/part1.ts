import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const [mazeRaw, stepsRaw] = readFileSync(path)
    .toString()
    .trim()
    .split("\n\n");
  const steps = stepsRaw
    .split("")
    .filter((x) => x != "\n")
    .map((x) => {
      switch (x) {
        case ">":
          return [0, 1];
        case "<":
          return [0, -1];
        case "^":
          return [-1, 0];
        default:
          return [1, 0];
      }
    });

  const maze = mazeRaw.split("\n").map((x) => x.split(""));
  let robot = maze.reduce<number[] | null>((p, c, row) => {
    const col = c.indexOf("@");
    return col >= 0 ? [row, col] : p;
  }, null);

  steps.forEach((step, i) => {
    if (!robot) return;

    const prevRobot = robot;
    const newLocation = robot.map((x, i) => x + step[i]);
    const object = maze[newLocation[0]][newLocation[1]];
    if (object == ".") {
      robot = newLocation;
    } else if (object == "O") {
      let nextLocation = newLocation.map((x, i) => x + step[i]);
      let nextObject = maze[nextLocation[0]][nextLocation[1]];
      while (nextObject == "O") {
        nextLocation = nextLocation.map((x, i) => x + step[i]);
        nextObject = maze[nextLocation[0]][nextLocation[1]];
      }
      if (nextObject == ".") {
        robot = newLocation;
        while (nextLocation[0] != robot[0] || nextLocation[1] != robot[1]) {
          maze[nextLocation[0]][nextLocation[1]] = "O";
          nextLocation = nextLocation.map((x, i) => x - step[i]);
        }
      }
    }

    maze[prevRobot[0]][prevRobot[1]] = ".";
    maze[robot[0]][robot[1]] = "@";
  });

  const gpsTotal = maze.reduce((total, r, row) => {
    const gpsRow = r.reduce((gps, c, col) => {
      if(c == "O"){
        return gps + 100 * row + col
      }
      return gps;
    }, 0);
    return total + gpsRow
  }, 0)
  console.log({gpsTotal})
}

main();
