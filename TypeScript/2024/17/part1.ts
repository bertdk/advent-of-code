import { readFileSync } from "fs";
import { join } from "path";

function main() {
  const path = join(__dirname, "input.txt");
  const input = readFileSync(path).toString().trim();

  const regex =
    /(Register A: )(?<registerA>\d*)(\nRegister B: )(?<registerB>\d*)(\nRegister C: )(?<registerC>\d*)(\n\nProgram: )(?<program>[\d,]*)/gm;

  const formated = regex.exec(input)?.groups;
  if (formated == null) return;

  const { registerA, registerB, registerC, program } = formated;
  const registers = [registerA, registerB, registerC].map((x) => Number(x));
  const p = program.split(",").map((x) => Number(x));

  let index = 0;
  const results: number[] = [];
  while (index < p.length) {
    const opcode = p[index];
    const comboOperand = p[index + 1];
    let operandValue: number;
    if (comboOperand <= 3) {
      operandValue = comboOperand;
    } else if (comboOperand <= 6) {
      operandValue = registers[comboOperand - 4];
      // if(comboOperand == 4){
      //   console.log(`Reading register A: ${operandValue}`)
      // }
    } else {
      operandValue = 7;
    }

    let normalStep = true;
    switch (opcode) {
      case 0:
        const adv = Math.floor(registers[0] / Math.pow(2, operandValue));
        // console.log({ adv });
        registers.splice(0, 1, adv);
        break;
      case 1:
        const bxl = registers[1] ^ operandValue;
        // console.log({ bxl });
        registers.splice(1, 1, bxl);
        break;
      case 2:
        const bst = operandValue % 8;
        // console.log({ bst });
        registers.splice(1, 1, bst);
        break;
      case 3:
        if (registers[0] != 0) {
          // console.log({ moveTo: operandValue });
          index = operandValue;
          normalStep = false;
        }
        break;
      case 4:
        const bxc = registers[1] ^ registers[2];
        // console.log({ bxc });
        registers.splice(1, 1, bxc);
        break;
      case 5:
        const out = operandValue % 8;
        // console.log({ out });
        results.push(out);
        break;
      case 6:
        const bdv = Math.floor(registers[0] / Math.pow(2, operandValue));
        // console.log({ bdv });
        registers.splice(1, 1, bdv);
        break;
      case 7:
        const cdv = Math.floor(registers[0] / Math.pow(2, operandValue));
        // console.log({ cdv });
        registers.splice(2, 1, cdv);
        break;
    }
    if (normalStep) {
      index += 2;
    }
  }
  console.log({ result: results.join(","), registers });
}

main();
