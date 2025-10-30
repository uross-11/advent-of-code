import { Solution } from "../index.js";

// y, x
const directions = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
] as const;

const directionMap = {
  "^": directions[0],
  ">": directions[1],
  v: directions[2],
  "<": directions[3],
} as const;

function turnCw(dir: (typeof directions)[number]): (typeof directions)[number] {
  const index = directions.findIndex((d) => d[0] === dir[0] && d[1] === dir[1]);
  return directions[(index + 1) % directions.length];
}

function moveAndCheckLoop(
  map: string[][],
  startPos: number[],
  startDir: (typeof directions)[number],
) {
  let [y, x] = startPos;
  let dir = startDir;
  const visited = new Set<string>();
  const seenStates = new Set<string>();

  visited.add(`${y},${x}`);
  seenStates.add(`${y},${x},${dir[0]},${dir[1]}`);

  while (true) {
    const ny = y + dir[0];
    const nx = x + dir[1];

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length)
      return { visited, loop: false };

    if (map[ny][nx] === "#") {
      dir = turnCw(dir);
      const state = `${y},${x},${dir[0]},${dir[1]}`;
      if (seenStates.has(state)) return { visited, loop: true };
      seenStates.add(state);
      continue;
    }

    y = ny;
    x = nx;
    visited.add(`${y},${x}`);
    const state = `${y},${x},${dir[0]},${dir[1]}`;
    if (seenStates.has(state)) return { visited, loop: true };
    seenStates.add(state);
  }
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const map: string[][] = [];
  const guardPos: number[] = [];
  let guardDir: (typeof directions)[number] = directions[0];

  for (const line of f.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const match = line.match(/[\^v<>]/);
    if (match) {
      const sym = match[0] as "^" | "v" | ">" | "<";
      guardPos.push(map.length, line.indexOf(sym));
      guardDir = directionMap[sym];
    }

    map.push(line.split(""));
  }

  const result = moveAndCheckLoop(map, guardPos, guardDir);
  p1 = result.visited.size;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== "." || (y === guardPos[0] && x === guardPos[1]))
        continue;

      map[y][x] = "#";
      const res = moveAndCheckLoop(map, guardPos, guardDir);
      if (res.loop) p2++;
      map[y][x] = ".";
    }
  }

  return { p1, p2 };
}

export default main;
