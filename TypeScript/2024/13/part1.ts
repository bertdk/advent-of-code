import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const input = readFileSync(path).toString();
  const costA = 3;
  const costB = 1;

  const regex =
    /(Button A: X\+)(?<AX>\d*)(, Y\+)(?<AY>\d*)(\nButton B: X\+)(?<BX>\d*)(, Y\+)(?<BY>\d*)(\nPrize: X=)(?<PX>\d*)(, Y=)(?<PY>\d*)/gm;
  const matches = input.matchAll(regex);
  let match = matches.next();

  let cost = 0;
  while (match.value) {
    const groups = match.value.groups;
    if (groups == null) return;
    const buttonA = [Number(groups.AX), Number(groups.AY)];
    const buttonB = [Number(groups.BX), Number(groups.BY)];
    const price = [Number(groups.PX), Number(groups.PY)];

    /**
     * buttonA[0] * pressA + buttonB[0] * pressB = price[0]
     * buttonA[1] * pressA + buttonB[1] * pressB = price[1]
     *
     * pressA = (price[0] - (buttonB[0] * pressB)) / buttonA[0]
     *
     * (price[0] * buttonA[1]) / buttonA[0]) - (buttonA[1] * buttonB[0] * pressB) / buttonA[0] + (buttonB[1] * pressB) = price[1]
     * (buttonB[1] - (buttonA[1] * buttonB[0]) / buttonA[0]) * pressB = price[1] - (price[0] * buttonA[1]) / buttonA[0])
     * pressB = (price[1] - (price[0] * buttonA[1]) / buttonA[0])) / (buttonB[1] - (buttonA[1] * buttonB[0]) / buttonA[0])
     */
    const pressB = Math.round(
      (price[1] - (price[0] * buttonA[1]) / buttonA[0]) /
        (buttonB[1] - (buttonA[1] * buttonB[0]) / buttonA[0])
    );
    const pressA = Math.round((price[0] - buttonB[0] * pressB) / buttonA[0]);

    if (
      buttonA[0] * pressA + buttonB[0] * pressB == price[0] &&
      buttonA[1] * pressA + buttonB[1] * pressB == price[1]
    ) {
      cost += pressA * costA + pressB * costB;
    }

    match = matches.next();
  }
  console.log({ cost });
}

main();
