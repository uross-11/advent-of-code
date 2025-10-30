import { Solution } from "../index.js";

function cartesian(chars: string, length = chars.length) {
  let results = [""];
  for (let i = 0; i < length; i++) {
    const newResults = [];
    for (const prefix of results) {
      for (const ch of chars) {
        newResults.push(prefix + ch);
      }
    }
    results = newResults;
  }
  return results;
}

function evaluate(nums: number[], ops: string[]) {
  let acc = nums[0];
  for (let i = 0; i < ops.length; i++) {
    const next = nums[i + 1];
    const op = ops[i];
    if (op === "+") acc += next;
    else if (op === "*") acc *= next;
    else if (op === "|") acc = Number(acc.toString() + next.toString());
  }
  return acc;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const allPermutations = new Map<string, string[]>();

  for (const line of f.split("\n")) {
    if (!line.trim()) continue;

    const [resStr, exprStr] = line.split(":");
    const result = Number(resStr);
    const expression = exprStr.trim().split(" ").map(Number);
    const opLen = expression.length - 1;

    const key1 = `p1-${opLen}`;
    const key2 = `p2-${opLen}`;

    let perm1: string[] = [];
    let perm2: string[] = [];

    if (allPermutations.has(key1)) {
      perm1 = allPermutations.get(key1)!;
    } else {
      perm1 = cartesian("*+", opLen);
      allPermutations.set(key1, perm1);
    }

    if (allPermutations.has(key2)) {
      perm2 = allPermutations.get(key2)!;
    } else {
      perm2 = cartesian("*+|", opLen);
      allPermutations.set(key2, perm2);
    }


    for (let p of perm1) {
      const val = evaluate(expression, p.split(""));
      if (val === result) {
        p1 += result;
        break;
      }
    }

    for (let p of perm2) {
      const val = evaluate(expression, p.split(""));
      if (val === result) {
        p2 += result;
        break;
      }
    }
  }

  return { p1, p2 };
}

export default main;
