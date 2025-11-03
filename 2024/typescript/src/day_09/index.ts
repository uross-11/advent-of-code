import { Solution } from "../index.js";

function fragment(
  count: number,
  index?: number,
): (string | number)[] | undefined {
  if (index !== undefined) return Array(count).fill(index);
  return count > 0 ? Array(count).fill(".") : undefined;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const fragmented: (string | number)[] = [];

  const files = new Map<number, [number, number]>();
  let empty: number[][] = [];

  let fid = 0;
  let pos = 0;

  for (let i = 0; i < f.length; i++) {
    const item = Number(f[i]);
    const a = i % 2 === 0 ? fragment(item, i / 2) : fragment(item);
    if (!a) continue;

    fragmented.push(...a);

    if (i % 2 === 0) {
      files.set(fid, [pos, item]);
      fid++;
    } else {
      empty.push([fragmented.length - item, item]);
    }

    pos += item;
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
    if (fragmented[i] !== ".") p1 += i * Number(fragmented[i]);
  }

  for (let id = fid - 1; id >= 0; id--) {
    const [pos, size] = files.get(id)!;

    for (let j = 0; j < empty.length; j++) {
      const [start, length] = empty[j];

      if (start >= pos) break;

      if (size <= length) {
        files.set(id, [start, size]);

        if (size === length) {
          empty.splice(j, 1);
        } else {
          empty[j] = [start + size, length - size];
        }

        empty.push([pos, size]);
        empty.sort((a, b) => a[0] - b[0]);
        break;
      }
    }
  }

  const layout = Array(fLen).fill(".");
  for (const [id, [start, size]] of files) {
    for (let k = 0; k < size; k++) layout[start + k] = id;
  }

  for (let i = 0; i < fLen; i++) {
    if (layout[i] !== ".") p2 += i * Number(layout[i]);
  }

  return { p1, p2 };
}

export default main;
