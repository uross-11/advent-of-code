import { Solution } from "../index.js";

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const instructions: number[][] = [];
  const lines: number[][] = [];
  const incorrectLines: number[][] = [];
  const instructionMap = new Map<number, Set<number>>();

  for (const line of f.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.includes("|")) instructions.push(line.split("|").map(Number));
    else lines.push(line.split(",").map(Number));
  }

  for (const [a, b] of instructions) {
    if (!instructionMap.has(a)) instructionMap.set(a, new Set());
    instructionMap.get(a)?.add(b);
  }

  for (const instruction of instructions) {
    for (let i = 0; i < lines.length; i++) {
      const left = lines[i].indexOf(instruction[0]);
      const right = lines[i].indexOf(instruction[1]);

      if (left !== -1 && right !== -1 && left > right) {
        incorrectLines.push(lines.splice(i, 1).flat());
      }
    }
  }

  const sortedIncorrect = incorrectLines.map((line) =>
    line.sort((a, b) => {
      if (instructionMap.get(a)?.has(b)) return -1;
      if (instructionMap.get(b)?.has(a)) return 1;
      return 0;
    }),
  );

  p1 = lines.map((l) => l[Math.floor(l.length / 2)]).reduce((a, c) => a + c);

  p2 = sortedIncorrect
    .map((l) => l[Math.floor(l.length / 2)])
    .reduce((a, c) => a + c);

  return { p1, p2 };
}

export default main;
