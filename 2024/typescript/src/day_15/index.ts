import { Solution } from "../index.js";

const directions = new Map([
  ["^", [-1, 0]],
  [">", [0, 1]],
  ["v", [1, 0]],
  ["<", [0, -1]],
]);

function push(
  dir: number[],
  item: number[],
  walls: Set<string>,
  boxes: Set<string>,
) {
  const np = [item[0] + dir[0], item[1] + dir[1]];
  const key = `${np[0]},${np[1]}`;

  if (walls.has(key)) return item;
  if (boxes.has(key)) {
    const nnp = push(dir, np, walls, boxes);
    if (nnp[0] === np[0] && nnp[1] === np[1]) return item;
    boxes.delete(key);
    boxes.add(`${nnp[0]},${nnp[1]}`);
  }

  return np;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const input = f.split("\n");

  let instructions = "";
  const walls = new Set<string>();
  const boxes = new Set<string>();
  let robot: number[] = [-1, -1];

  for (let i = 0; i < input.length; i++) {
    if (!input[i]) continue;

    if (input[i][0] === "#") {
      for (let j = 0; j < input[i].length; j++) {
        const ch = input[i][j];

        switch (ch) {
          case "#":
            walls.add(`${i},${j}`);
            break;
          case "O":
            boxes.add(`${i},${j}`);
            break;
          case "@":
            robot = [i, j];
            break;
        }
      }

      continue;
    }

    instructions += input[i];
  }

  for (const i of instructions) {
    const np = push(directions.get(i)!, robot, walls, boxes);
    if (np) {
      robot = np;
      // console.log("\n", i);
      // console.log(
      //   input
      //     .map((l, lx) =>
      //       l
      //         .split("")
      //         .map((c, cx) =>
      //           c === "#"
      //             ? "#"
      //             : robot[0] === lx && robot[1] === cx
      //               ? "@"
      //               : boxes.has(`${lx},${cx}`)
      //                 ? "O"
      //                 : ".",
      //         )
      //         .join(" "),
      //     )
      //     .join("\n"),
      // );
    }
  }

  for (const box of boxes) {
    const [y, x] = box.split(",");
    p1 += 100 * Number(y) + Number(x);
  }

  return { p1, p2 };
}

export default main;
