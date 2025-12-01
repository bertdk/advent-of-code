import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const input = readFileSync(path).toString().trim();

  const outfile = join(__dirname, "output.txt");
  const prevOutput = readFileSync(outfile).toString().trim().split("\n");
  const prevLast = prevOutput[prevOutput.length - 1];
  const outRegex = /(value: )(?<lastResult>\d*)/gm;
  const lastRaw = outRegex.exec(prevLast)?.groups?.lastResult;
  let tryValue = 190627157074968; // 190627181797494 // 169807780748539; // [190627342669826, 190628752088814]
  // if(lastRaw){
  //   tryValue = Number(lastRaw)
  // }

  const regex =
    /(Register A: )(?<registerA>\d*)(\nRegister B: )(?<registerB>\d*)(\nRegister C: )(?<registerC>\d*)(\n\nProgram: )(?<program>[\d,]*)/gm;

  const formated = regex.exec(input)?.groups;
  if (formated == null) return;

  const { registerA, registerB, registerC, program } = formated;
  const registers = [registerA, registerB, registerC].map((x) => Number(x));
  const p = program.split(",").map((x) => Number(x));

  const max = 190627291595524 + 10000; // 190627830015136// 190635602761840 // 211108240821809; // 190765981485434
  const step = 1;
  let tryResult = "";
  writeFileSync(outfile, "");

  while (tryResult != program && tryValue < max) {
    console.log({ tryValue });
    if (tryResult.length > 3)
      appendFileSync(
        outfile,
        "value: " + tryValue.toString() + " result: " + tryResult + "\n"
      );
    registers.splice(0, 1, tryValue);
    let index = 0;
    const results: number[] = [];
    let continueLoop = true;
    while (index < p.length && continueLoop) {
      continueLoop = true;
      const opcode = p[index];
      const comboOperand = p[index + 1];
      let operandValue: number;
      if (comboOperand <= 3) {
        operandValue = comboOperand;
      } else if (comboOperand <= 6) {
        operandValue = registers[comboOperand - 4];
      } else {
        operandValue = 7;
      }

      let normalStep = true;
      switch (opcode) {
        case 0:
          const adv = Math.floor(registers[0] / Math.pow(2, operandValue));
          registers.splice(0, 1, adv);
          break;
        case 1:
          const bxl = registers[1] ^ operandValue;
          registers.splice(1, 1, bxl);
          break;
        case 2:
          const bst = operandValue % 8;
          registers.splice(1, 1, bst);
          break;
        case 3:
          if (registers[0] != 0) {
            index = operandValue;
            normalStep = false;
          }
          break;
        case 4:
          const bxc = registers[1] ^ registers[2];
          registers.splice(1, 1, bxc);
          break;
        case 5:
          const out = operandValue % 8;
          if (out < 0 || out != p[results.length]) {
            continueLoop = false;
            break;
          }
          results.push(out);
          break;
        case 6:
          const bdv = Math.floor(registers[0] / Math.pow(2, operandValue));
          registers.splice(1, 1, bdv);
          break;
        case 7:
          const cdv = Math.floor(registers[0] / Math.pow(2, operandValue));
          registers.splice(2, 1, cdv);
          break;
      }
      if (normalStep) {
        index += 2;
      }
    }
    tryResult = results.join(",");
    tryValue += step;
  }
  appendFileSync(outfile, "Finished");
}

main();

// Correct: 190384609508367n