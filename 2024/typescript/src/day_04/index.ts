import { readFileSync } from "node:fs";
import { importPathFuckery, printOutput } from "../utils.js";

// y, x
const dir = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function search(
  grid: string[],
  word: string,
  y: number,
  x: number,
  dy: number,
  dx: number,
  index: number,
): boolean {
  if (index === word.length) return true;
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length) return false;
  if (grid[y][x] !== word[index]) return false;

  return search(grid, word, y + dy, x + dx, dy, dx, index + 1);
}

function main(test: boolean) {
  const file = readFileSync(
    importPathFuckery(`src/day_04/${test ? "test" : "input"}`),
    "utf8",
  )
    .trim()
    .split(/\r?\n/);

  let p1 = 0;
  let p2 = 0;

  const word = "XMAS";

  for (let y = 0; y < file.length; y++) {
    for (let x = 0; x < file[y].length; x++) {
      const char = file[y][x];
      if (char === "X") {
        for (const [dy, dx] of dir) {
          if (!search(file, word, y, x, dy, dx, 0)) continue;

          p1++;
        }
      }

      if (char === "A") {
        if (y > 0 && y < file.length - 1 && x > 0 && x < file[y].length - 1) {
          const tl = file[y - 1][x - 1];
          const tr = file[y - 1][x + 1];
          const bl = file[y + 1][x - 1];
          const br = file[y + 1][x + 1];

          const diag1 = tl + "A" + br;
          const diag2 = tr + "A" + bl;

          if (
            (diag1 === "MAS" || diag1 === "SAM") &&
            (diag2 === "MAS" || diag2 === "SAM")
          )
            p2++;
        }
      }
    }
  }

  printOutput("04", p1, p2);
}

export default main;
