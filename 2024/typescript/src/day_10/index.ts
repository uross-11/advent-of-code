import { Solution } from "../index.js";

const dir = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
] as const;

function walk(
  map: number[][],
  visited: Set<string>,
  currentPath: string[],
  goal: Set<string>,
  y: number,
  x: number,
  p1: boolean,
): number {
  if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) return 0;

  const key = `${y},${x}`;
  if (visited.has(key)) return 0;

  if (currentPath.length > 0) {
    const [prevY, prevX] = currentPath[currentPath.length - 1]
      .split(",")
      .map(Number);
    if (map[y][x] !== map[prevY][prevX] + 1) return 0;
  }

  visited.add(key);
  currentPath.push(key);

  let found = 0;
  if (map[y][x] === 9) {
    // console.log(JSON.stringify(map.map((l, iX) => l.map((i, iY) => Number.isNaN(i) ? " . " : visited.has(`${iX},${iY}`) ? `(${i})` : ` ${i} `).join("")), null, 2));
    goal.add(`${y},${x}`);
    found = 1;
  }

  for (const [dy, dx] of dir) {
    found += walk(map, visited, currentPath, goal, y + dy, x + dx, p1);
  }

  currentPath.pop();
  visited.delete(key);

  return p1 ? goal.size : found;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const map: number[][] = f.split("\n").map((l) => l.split("").map(Number));
  const height = map.length;
  const width = map[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] !== 0) continue;

      p1 += walk(map, new Set(), [], new Set(), i, j, true);
      p2 += walk(map, new Set(), [], new Set(), i, j, false);
    }
  }

  return { p1, p2 };
}

export default main;
