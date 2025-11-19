import { Solution } from "../index.js";

const dir = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
] as const;

function dijkstra(
  start: number[],
  end: number[],
  rows: number,
  cols: number,
  input: string[],
): number {
  const pq = [[0, start[0], start[1], 0]]; // cost, r, c, dir
  const seen = new Set<string>();

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, r, c, d] = pq.shift()!;

    if (r === end[0] && c === end[1]) {
      return cost;
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

  return -1;
}

function dijkstraAllPaths(
  start: number[],
  end: number[],
  rows: number,
  cols: number,
  input: string[],
): number {
  type State = [number, number, number, number, Set<string>];

  const pq: State[] = [
    [0, start[0], start[1], 0, new Set([`${start[0]},${start[1]}`])],
  ];
  const visited = new Map<string, number>();
  let lowestScore: number | null = null;
  const winningPaths = new Set<string>();

  const canVisit = (
    d: number,
    r: number,
    c: number,
    score: number,
  ): boolean => {
    const key = `${d},${r},${c}`;
    const prevScore = visited.get(key);
    if (prevScore !== undefined && prevScore < score) return false;

    visited.set(key, score);
    return true;
  };

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, r, c, d, path] = pq.shift()!;

    if (lowestScore !== null && lowestScore < cost) break;

    if (r === end[0] && c === end[1]) {
      lowestScore = cost;
      path.forEach((pos) => winningPaths.add(pos));
      continue;
    }

    if (!canVisit(d, r, c, cost)) continue;

    const [nr, nc] = [r + dir[d][0], c + dir[d][1]];
    if (
      nr >= 0 &&
      nr < rows &&
      nc >= 0 &&
      nc < cols &&
      input[nr][nc] !== "#" &&
      canVisit(d, nr, nc, cost + 1)
    ) {
      const newPath = new Set(path);
      newPath.add(`${nr},${nc}`);
      pq.push([cost + 1, nr, nc, d, newPath]);
    }

    const leftD = (d + 3) % 4;
    if (canVisit(leftD, r, c, cost + 1000))
      pq.push([cost + 1000, r, c, leftD, new Set(path)]);

    const rightD = (d + 1) % 4;
    if (canVisit(rightD, r, c, cost + 1000))
      pq.push([cost + 1000, r, c, rightD, new Set(path)]);
  }

  return winningPaths.size;
}

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

  p1 = dijkstra(start, end, rows, cols, input);
  p2 = dijkstraAllPaths(start, end, rows, cols, input);

  return { p1, p2 };
}

export default main;
