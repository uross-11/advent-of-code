import { readFileSync } from "node:fs";
import { importPathFuckery, printOutput } from "../utils.js";

function main(test: boolean) {
  const file = readFileSync(
    importPathFuckery(`src/day_03/${test ? "test" : "input"}`),
    "utf8",
  ).trim();

  let test2: string | null = null;

  if (test) {
    test2 = readFileSync(importPathFuckery("src/day_03/test2"), "utf8").trim();
  }

  const p1 = [...file.matchAll(new RegExp(/mul\(\s*-?\d+\s*,\s*-?\d+\s*\)/g))]
    .map((m) =>
      m[0]
        .substring(4, m[0].length - 1)
        .split(",")
        .map(Number),
    )
    .map(([a, b]) => a * b)
    .reduce((a, b) => a + b, 0);

  const expression = new RegExp(
    /mul\(\s*-?\d+\s*,\s*-?\d+\s*\)|do\(\)|don\'t\(\)/g,
  );
  let enabled = true;
  let p2 = 0;
  const file2 = test ? test2 : file;

  if (!file2) return console.error("No input file found for day 03");

  for (const match of file2.matchAll(expression)) {
    const str = match[0];
    if (str === "do()") enabled = true;
    else if (str === "don't()") enabled = false;
    else if (enabled) {
      const [a, b] = str
        .substring(4, str.length - 1)
        .split(",")
        .map(Number);
      p2 += a * b;
    }
  }

  printOutput("03", p1, p2);
}

export default main;
