import { Solution } from "../index.js";

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const instructions: number[][] = [];
  const lines: number[][] = [];

  const incorrectLines: number[][] = [];

  for (const line of f.split(/\r?\n/)) {
    if (line.trim() === "") continue;

    if (line.includes("|")) instructions.push(line.split("|").map(Number));
    else lines.push(line.split(",").map(Number));
  }

  for (const instruction of instructions) {
    for (let i = 0; i < lines.length; i++) {
      const left = lines[i].indexOf(instruction[0]);
      const right = lines[i].indexOf(instruction[1]);

      if (left !== -1 && right !== -1 && left > right) {
        // sort
        // extract
        // push

        const a = instruction[0];
        const b = instruction[1];

        lines[i][left] = b;
        lines[i][right] = a;

        const removed = lines.splice(i, 1).flat();

        incorrectLines.push(removed);
      }
    }
  }

  console.log("Incorrect lines:", incorrectLines);

  p1 = lines.map((l) => l[Math.floor(l.length / 2)]).reduce((a, c) => a + c);

  return { p1, p2 };
}

export default main;
