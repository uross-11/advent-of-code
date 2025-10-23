import { readFileSync } from "node:fs";
import { importPathFuckery, printOutput } from "../utils.js";

function main(test: boolean) {
  const file = readFileSync(
    importPathFuckery(`src/day_01/${test ? "test" : "input"}`),
    "utf8",
  )
    .trim()
    .split(/\r?\n/);

  let p1 = 0;
  let p2 = 0;
  let len = 0;

  const left: number[] = [];
  const right: number[] = [];

  for (const line of file) {
    const values = line.split("   ");
    left.push(Number(values[0]));
    right.push(Number(values[1]));
    len++;
  }

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  for (let i = 0; i < len; i++) {
    p1 += Math.abs(left[i] - right[i]);
  }

  const rightCount: Map<number, number> = new Map(
    [...new Set(right)].map((x) => [x, right.filter((y) => y === x).length]),
  );

  for (let i = 0; i < len; i++) {
    const num = left[i];
    const count = rightCount.get(num) ?? 0;

    p2 += num * count;
  }

  printOutput("01", p1, p2);
}

export default main;
