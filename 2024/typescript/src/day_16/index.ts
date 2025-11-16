import { Solution } from "../index.js";

const dir = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
] as const;

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const input = f.split("\n");

  let end = [-1, -1];
  let start = [-1, -1];

  const rows = input.length;
  const cols = input[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const c = input[i][j];
      if (c === "S") start = [i, j];
      if (c === "E") end = [i, j];
    }
  }

  const pq = [[0, start[0], start[1], 0]]; // cost, r, c, dir
  const seen = new Set<string>();

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, r, c, d] = pq.shift()!;

    if (r === end[0] && c === end[1]) {
      p1 = cost;
      break;
    }
    const key = `${r},${c},${d}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const [nr, nc] = [r + dir[d][0], c + dir[d][1]];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && input[nr][nc] !== "#") {
      pq.push([cost + 1, nr, nc, d]);
    }

    pq.push([cost + 1000, r, c, (d + 3) % 4]);
    pq.push([cost + 1000, r, c, (d + 1) % 4]);
  }

  return { p1, p2 };
}

export default main;
