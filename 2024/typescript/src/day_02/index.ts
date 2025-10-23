import { readFileSync } from "node:fs";
import { importPathFuckery, printOutput } from "../utils.js";

function main(test: boolean) {
  const file = readFileSync(
    importPathFuckery(`src/day_02/${test ? "test" : "input"}`),
    "utf8",
  )
    .trim()
    .split(/\r?\n/);

  let p1 = 0;

  for (const line of file) {
    const arr = line.split(" ").map(Number);
    const diffs = arr.slice(1).map((n, i) => n - arr[i]);
    const order = diffs[0] > 0 ? "asc" : "desc";
    const safe = diffs.every(
      (d) =>
        (order === "asc" && d >= 1 && d <= 3) ||
        (order === "desc" && d <= -1 && d >= -3),
    );

    if (safe) p1++;
  }

  printOutput("02", p1, 0);
}

export default main;
