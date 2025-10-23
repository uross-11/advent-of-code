import { readFileSync } from "node:fs";
import { importPathFuckery, printOutput } from "../utils.js";

enum Order {
  ASC,
  DESC,
}

function isSafe(arr: number[]): boolean {
  let order: Order | null = null;
  let last = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const diff = arr[i] - last;

    if (diff === 0) return false;

    if (i === 1) {
      order = diff > 0 ? Order.ASC : Order.DESC;
    }

    if (order === Order.ASC && (diff > 3 || diff < 1)) return false;
    if (order === Order.DESC && (diff < -3 || diff > -1)) return false;

    last = arr[i];
  }

  return true;
}

function main(test: boolean) {
  const file = readFileSync(
    importPathFuckery(`src/day_02/${test ? "test" : "input"}`),
    "utf8",
  )
    .trim()
    .split(/\r?\n/);

  let p1 = 0;
  let p2 = 0;

  for (const line of file) {
    const arr = line.split(" ").map(Number);

    const safe = isSafe(arr);
    if (safe) {
      p1++;
      p2++;
      continue;
    }

    let dampened = false;
    for (let i = 0; i < arr.length; i++) {
      const modified = arr.slice(0, i).concat(arr.slice(i + 1));

      if (isSafe(modified)) {
        dampened = true;
        break;
      }
    }

    if (dampened) p2++;
  }

  printOutput("02", p1, p2);
}

export default main;

// xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
