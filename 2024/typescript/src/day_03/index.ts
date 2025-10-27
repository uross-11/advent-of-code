import { Solution } from "../index.js";

function main(f: string): Solution {
  const file = f;

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

  for (const match of file.matchAll(expression)) {
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

  return { p1, p2 };
}

export default main;
