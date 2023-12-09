import { readFileSync } from "fs";
import path from "path";

const main = () => {
  const filePath = path.join(__dirname, "sample.txt");
  const file = readFileSync(filePath);
  const lines = file.toString().split("\n");

  const [times, distances] = lines.map((line) => {
    const [_, numbers] = line.split(":");
    return numbers
      .trim()
      .split(" ")
      .filter((x) => x && x != "")
      .map((x) => Number(x));
  });
  let result = 1;

  /**
   * d = (t_press) * (t_max - t_press)
   * d = (t_press * t_max) - (t_press)^2
   * 0 = (t_press * t_max) - (t_press)^2 - d
   * 0 = t_press ^ 2 - t_max * t_press + d
   * t_press = (t_max + sqrt(t_max^2 + 4 * d))/2
   * t_press = (t_max - sqrt(t_max^2 + 4 * d))/2
   */

  for (let index = 0; index < distances.length; index++) {
    const distance = distances[index];
    const timeMax = times[index];
    const sqrt = Math.sqrt(Math.pow(timeMax, 2) - 4 * distance);

    const pressTimes = [(timeMax - sqrt) / 2, (timeMax + sqrt) / 2].sort(
      (a, b) => a - b
    );
    let pressMin = Math.ceil(pressTimes[0]);
    if (pressMin === pressTimes[0]) pressMin++;
    let pressMax = Math.floor(pressTimes[1]);
    if (pressMax === pressTimes[1]) pressMax--;

    result *= pressMax - pressMin + 1;
  }

  console.log(result);
};

main();
