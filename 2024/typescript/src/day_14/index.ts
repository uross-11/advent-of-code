import { Solution } from "../index.js";

function mod(a: number, n: number) {
  return ((a % n) + n) % n;
}

function step(
  robots: Map<number, { p: number[]; v: number[] }>,
  count: number,
  w: number,
  h: number,
  i?: number,
): number | void {
  const map: (string | number)[][] = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => " "),
  );

  for (const [key, robot] of robots.entries()) {
    const { p, v } = robot;
    const finalX = mod(p[0] + v[0] * count, w);
    const finalY = mod(p[1] + v[1] * count, h);

    robots.set(key, { ...robots.get(key)!, p: [finalX, finalY] });
    map[finalY][finalX] = "#";
  }

  if (i)
    for (let y = 0; y < h; y++)
      if (map[y].join("").indexOf("##################") !== -1) return i + 1;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const input = f.split("\n");
  const len = input.length;
  const [w, h] = input[0].split(",").map(Number);
  const robots = new Map<number, { p: number[]; v: number[] }>();
  const robots2 = new Map<number, { p: number[]; v: number[] }>();
  const safetyIndexes = [0, 0, 0, 0];

  for (let i = 1; i < len; i++) {
    const [p, v] = input[i]
      .replace("p=", "")
      .replace("v=", "")
      .split(" ")
      .map((i) => i.split(",").map(Number));

    robots.set(i - 1, { p, v });
    robots2.set(i - 1, { p, v });
  }

  step(robots, 100, w, h);

  for (let i = 0; i < 10_000; i++) {
    const sol = step(robots2, 1, w, h, i);
    if (sol) {
      p2 = sol;
      break;
    }
  }

  for (const robot of robots.values()) {
    const {
      p: [x, y],
    } = robot;

    const wH = Math.floor(w / 2);
    const hH = Math.floor(h / 2);

    if (x === wH || y === hH) continue;

    if (x < wH && y < hH) safetyIndexes[0]++;
    if (x < wH && y > hH) safetyIndexes[1]++;
    if (x > wH && y < hH) safetyIndexes[2]++;
    if (x > wH && y > hH) safetyIndexes[3]++;
  }

  p1 += safetyIndexes.reduce((a, b) => a * b, 1);

  return { p1, p2 };
}

export default main;
