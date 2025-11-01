import { Solution } from "../index.js";

function fragment(
  count: string,
  index?: number,
): (string | number)[] | undefined {
  const c = Number(count);
  if (index !== undefined) return Array(c).fill(index);
  return c > 0 ? Array(c).fill(".") : undefined;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const fragmented: (string | number)[] = [];

  for (let i = 0; i < f.length; i++) {
    let a = i % 2 === 0 ? fragment(f[i], i / 2) : fragment(f[i]);

    if (a) fragmented.push(...a);
  }

  const fLen = fragmented.length;

  let left = 0;
  let right = fLen - 1;

  while (left < right) {
    if (fragmented[left] !== ".") {
      left++;
      continue;
    }
    if (fragmented[right] === ".") {
      right--;
      continue;
    }

    fragmented[left] = fragmented[right];
    fragmented[right] = ".";
    left++;
    right--;
  }

  for (let i = 0; i < fLen; i++) {
    if (fragmented[i] === ".") continue;
    p1 += i * Number(fragmented[i]);
  }

  return { p1, p2 };
}

export default main;
