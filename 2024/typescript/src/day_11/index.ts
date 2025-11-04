import { Solution } from "../index.js";

function blink(counts: Map<string, number>): Map<string, number> {
  const newCounts = new Map<string, number>();

  for (const [number, count] of counts.entries()) {
    if (number === "0") {
      newCounts.set("1", (newCounts.get("1") ?? 0) + count);
    } else if (number.length % 2 === 0) {
      const left = Number(number.slice(0, number.length / 2)).toString();
      const right = Number(number.slice(number.length / 2)).toString();
      newCounts.set(left, (newCounts.get(left) ?? 0) + count);
      newCounts.set(right, (newCounts.get(right) ?? 0) + count);
    } else {
      const next = (Number(number) * 2024).toString();
      newCounts.set(next, (newCounts.get(next) ?? 0) + count);
    }
  }

  return newCounts;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  let initial = f.split(" ");
  const counts = new Map<string, number>();

  for (const n of initial) counts.set(n, (counts.get(n) ?? 0) + 1);

  let current = counts;
  const blinkSize = process.argv.slice(2)[0] === "--test=true" ? 6 : 25;

  for (let i = 0; i < blinkSize; i++) current = blink(current);
  p1 = [...current.values()].reduce((a, b) => a + b, 0);

  for (let i = 0; i < 50; i++) current = blink(current);
  p2 = [...current.values()].reduce((a, b) => a + b, 0);

  return { p1, p2 };
}

export default main;
