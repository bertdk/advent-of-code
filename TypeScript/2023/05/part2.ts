import { readFileSync } from "fs";
import path from "path";

type Range = { start: number; end: number };
const rangesOverlap = (x: Range, y: Range) => {
  const isLeftOut = x.start >= y.end;
  const isRightOut = x.end <= y.start;
  return !(isLeftOut || isRightOut);
};

const translateToDestination = (
  destination: number,
  currentStart: number,
  currentValue: Range
) => {
  return {
    start: destination + currentValue.start - currentStart,
    end: destination + currentValue.end - currentStart,
    isMapped: true,
  };
};

const getSubRanges = (boundaries: Range, range: Range, destination: number) => {
  if (!rangesOverlap(boundaries, range))
    return [{ ...boundaries, isMapped: false }];

  const result: (Range & { isMapped?: boolean })[] = [];
  // Left
  if (boundaries.start >= range.start && boundaries.end > range.end) {
    result.push(
      translateToDestination(destination, range.start, {
        start: boundaries.start,
        end: range.end,
      }),
      { start: range.end, end: boundaries.end }
    );
  }
  // Right
  else if (boundaries.start < range.start && boundaries.end < range.end) {
    result.push(
      { start: boundaries.start, end: range.start },
      translateToDestination(destination, range.start, {
        start: range.start,
        end: boundaries.end,
      })
    );
  }
  // In
  else if (boundaries.start <= range.start && boundaries.end >= range.end) {
    result.push(
      { start: boundaries.start, end: range.start },
      translateToDestination(destination, range.start, {
        start: range.start,
        end: boundaries.end,
      }),
      { start: boundaries.end, end: range.end }
    );
  }
  // Out
  else if (boundaries.start >= range.start && boundaries.end <= range.end) {
    result.push(
      translateToDestination(destination, range.start, {
        start: boundaries.start,
        end: boundaries.end,
      })
    );
  }

  return result;
};

const main = (category: string) => {
  const filePath = path.join(__dirname, "input.txt");
  const file = readFileSync(filePath);
  const lines = file.toString().split("\n");

  const initial = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((x) => Number(x));
  const ranges: Range[] = [];
  for (let index = 0; index < initial.length; index += 2) {
    const start = initial[index];
    const step = initial[index + 1];
    ranges.push({ start, end: start + step });
  }

  let currentCategory = "";
  let currentValues = ranges;
  let newValues: Range[] = [];
  let endOfCategory = false;
  let currentLine = 2;

  while (currentCategory != category || !endOfCategory) {
    const line = lines[currentLine];
    currentLine++;

    const mappingMatch = line.match(/(?<from>\w*)-to-(?<to>\w*) map\:/);
    if (mappingMatch?.groups?.from) {
      currentCategory = mappingMatch?.groups?.to;
      console.log(`Current category: ${currentCategory}`);
    }

    const rangeMatch = line.match(
      /(?<destination>\d*) (?<source>\d*) (?<step>\d*)/
    );
    if (rangeMatch?.groups?.source) {
      const source = Number(rangeMatch.groups.source);
      const destination = Number(rangeMatch.groups.destination);
      const step = Number(rangeMatch.groups.step);

      const filterValues: number[] = [];
      const currentRange: Range = { start: source, end: source + step };
      const replaceRanges: Range[] = [];

      currentValues.map((x, i) => {
        const newRanges = getSubRanges(x, currentRange, destination);

        if (newRanges.some((y) => y.isMapped)) {
          newValues.push(...newRanges.filter((r) => r.isMapped));
          replaceRanges.push(...newRanges.filter((r) => !r.isMapped));
          filterValues.push(i);
        }
      });

      // console.log(
      //   `- Line ${line} values: ${currentValues.map(
      //     (x) => `[${x.start},${x.end},]`
      //   )} -> out: ${filterValues}\t\treplace: ${replaceRanges.map(
      //     (x) => `[${x.start}, ${x.end}]`
      //   )}\t\tnew: ${newValues.map((x) => `[${x.start}, ${x.end}]`)}`
      // );
      currentValues = currentValues.filter((_, i) => !filterValues.includes(i));
      currentValues.push(...replaceRanges);
    }

    endOfCategory = line === "" || lines.length === currentLine;
    if (endOfCategory) {
      // console.log(`- No mapping ${currentValues}`);
      currentValues.push(...newValues);
      newValues = [];
    }
  }

  const result = Math.min(...currentValues.map((x) => x.start));
  console.log(result);
};

main("location");
