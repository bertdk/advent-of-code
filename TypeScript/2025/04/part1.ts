import path from "path";
import fs from "fs";

function main() {
  const filePath = path.join(__dirname, "input.txt");

  const file = fs.readFileSync(filePath);
  const board = file
    .toString()
    .split("\n")
    .filter((c) => c.length > 1)
    .map((l) => l.split(""));

  let result = 0;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const element = board[row][col];
      let rollsAround = 0;
      if (element !== "@") continue;
      for (const direction of directions) {
        const newRow = row + direction[0];
        const newCol = col + direction[1];

        if (newRow < 0 || newCol < 0 || newRow >= rows || newCol >= cols) {
          continue;
        }

        if(board[newRow][newCol] === "@"){
          rollsAround++;
        }
      }

      if(rollsAround < 4){
        result++;
      }
    }
  }

  console.log(result);
}

main();
