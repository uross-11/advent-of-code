import { Solution } from "../index.js";

const dir = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
] as const;

function explore(
  map: string[][],
  visited: Set<string>,
  char: string,
  area: Set<string>,
  fences: Set<string>,
  y: number,
  x: number,
) {
  if (
    y < 0 ||
    y >= map.length ||
    x < 0 ||
    x >= map[0].length ||
    map[y][x] !== char
  )
    return area;

  const key = `${y},${x}`;
  if (area.has(key)) return area;

  area.add(key);
  visited.add(key);

  for (const [dy, dx] of dir) {
    const newY = y + dy;
    const newX = x + dx;

    if (newY < 0) fences.add(`${key}:top`);
    else if (newY >= map.length) fences.add(`${key}:bottom`);
    else if (newX < 0) fences.add(`${key}:left`);
    else if (newX >= map[0].length) fences.add(`${key}:right`);
    else if (map[newY][newX] !== char)
      fences.add(
        `${key}:${
          dy === -1 && dx === 0
            ? "top"
            : dy === 0 && dx === 1
              ? "right"
              : dy === 1 && dx === 0
                ? "bottom"
                : "left"
        }`,
      );

    explore(map, visited, char, area, fences, newY, newX);
  }

  return area;
}

function groupFences(fences: Set<string>): Set<string> {
  const result = new Set<string>();
  const visited = new Set<string>();

  console.log(fences);

  for (const fence of fences.values()) {
    const [yx, side] = fence.split(":");
    const [y, x] = yx.split(",");

    if (visited.has(fence)) continue;

    visited.add(fence);

    if (side === "top" || side === "bottom") {
      let i = 1;
      for (const dir of [-1, 1]) {
        const key = `${y},${Number(x) + dir * i}:${side}`;

        console.log(key);

        while (fences.has(key)) {
          visited.add(key);
          i++;
        }
      }
    } else {
    }

    // if (side === "top" || side === "bottom") {
    //   result.add(`${y}:${side}`);
    // } else {
    //   result.add(`${x}:${side}`);
    // }
  }

  console.log(visited);

  return result;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const visited = new Set<string>();
  const map: string[][] = f.split("\n").map((l) => l.split(""));

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (visited.has(`${i},${j}`)) continue;

      const fences = new Set<string>();
      const area = explore(map, visited, map[i][j], new Set(), fences, i, j);
      p1 += area.size * fences.size;

      if (map[i][j] === "J") {
        const fences2 = groupFences(fences);

        // console.log(area.size, fences2);
        console.log(
          JSON.stringify(
            map.map((l, iX) =>
              l
                .map((i, iY) =>
                  Number.isNaN(i)
                    ? " . "
                    : area.has(`${iX},${iY}`)
                      ? `(${i})`
                      : ` ${i} `,
                )
                .join(""),
            ),
            null,
            2,
          ),
        );
      }

      // p2 += area.size * fences2.size;
    }
  }

  return { p1, p2 };
}

export default main;
