import { readFileSync } from "fs";
import { join } from "path";

const part2 = () => {
    const path = join(__dirname, "input.txt");
    const input = readFileSync(path).toString().trim();
  
    const regex =
      /(Register A: )(?<registerA>\d+)(\nRegister B: )(?<registerB>\d+)(\nRegister C: )(?<registerC>\d+)(\n\nProgram: )(?<program>[\d,]+)/;
  
    const match = regex.exec(input);
    if (!match || !match.groups) {
      console.error("Failed to parse input. Ensure the file format matches the expected structure.");
      return;
    }
  
    const { program } = match.groups;
    const programArray = program.split(",").map(BigInt).reverse();
  
    // Integer floor division
    const floorDiv = (a: bigint, b: bigint): bigint => (a - (a % b)) / b;
  
    // Test function
    const test = (a: bigint): bigint => {
      const divisor = 2n ** ((a % 8n) ^ 1n); // Debug this separately if needed
      const result =
        ((((a % 8n) ^ 1n) ^ 5n) ^ floorDiv(a, divisor)) % 8n;
  
      console.log(`test(${a}): divisor=${divisor}, result=${result}`); // Debugging
      return result;
    };
  
    let answers: bigint[] = [0n];
  
    for (const p of programArray) {
      console.log(`Processing program value: ${p}`); // Debug the current program value
      const newAnswers: bigint[] = [];
      for (const curr of answers) {
        for (let a = 0n; a < 8n; a++) {
          const toTest = (curr << 3n) + a;
          const out = test(toTest);
          console.log(`toTest: ${toTest}, out: ${out}, p: ${p}`); // Debug matching logic
          if (out === p) {
            newAnswers.push(toTest);
          }
        }
      }
      answers = newAnswers;
      console.log(`Intermediate Answers for ${p}:`, answers); // Debug answers after each step
  
      if (answers.length === 0) {
        console.error(`No valid answers found for program value: ${p}`);
        return;
      }
    }
  
    const answer = answers.reduce((min, curr) => (curr < min ? curr : min), answers[0]);
    console.log(`Part 2: ${answer.toString()}`);
  };
  
  // Run the function
  part2();
  