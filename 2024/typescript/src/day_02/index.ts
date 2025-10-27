import { Solution } from "../index.js";

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

function main(f: string): Solution {
  const file = f.split(/\r?\n/);

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

  return { p1, p2 };
}

export default main;
