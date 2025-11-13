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

function push2(
  dir: number[],
  item: number[],
  walls: Set<string>,
  boxes: Set<string>,
) {
  const np = [item[0] + dir[0], item[1] + dir[1]];
  const key = `${np[0]},${np[1]}`;

  if (walls.has(key)) return item;

  const toMove = new Set<string>();
  const queue: number[][] = [np];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const pos = queue.shift()!;
    const posKey = `${pos[0]},${pos[1]}`;

    if (visited.has(posKey)) continue;
    visited.add(posKey);

    if (walls.has(posKey)) return item;

    if (boxes.has(`l:${posKey}`)) {
      toMove.add(`l:${posKey}`);
      toMove.add(`r:${pos[0]},${pos[1] + 1}`);
      queue.push([pos[0] + dir[0], pos[1] + dir[1]]);
      queue.push([pos[0] + dir[0], pos[1] + 1 + dir[1]]);
    } else if (boxes.has(`r:${posKey}`)) {
      toMove.add(`r:${posKey}`);
      toMove.add(`l:${pos[0]},${pos[1] - 1}`);
      queue.push([pos[0] + dir[0], pos[1] + dir[1]]);
      queue.push([pos[0] + dir[0], pos[1] - 1 + dir[1]]);
    }
  }

  for (const box of toMove) boxes.delete(box);

  for (const box of toMove) {
    const [side, coords] = box.split(":");
    const [y, x] = coords.split(",").map(Number);
    boxes.add(`${side}:${y + dir[0]},${x + dir[1]}`);
  }

  return np;
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  let input = f.split("\n");

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
    if (np) robot = np;
  }

  for (const box of boxes) {
    const [y, x] = box.split(",");
    p1 += 100 * Number(y) + Number(x);
  }

  input = input
    .filter((l) => l[0] === "#")
    .map((l) =>
      l
        .split("")
        .map((c) => {
          switch (c) {
            case "#":
              return "##";
            case "O":
              return "[]";
            case ".":
              return "..";
            case "@":
              return "@.";
          }
        })
        .join(""),
    );

  walls.clear();
  boxes.clear();
  robot = [-1, -1];

  for (let i = 0; i < input.length; i++) {
    if (input[i][0] === "#") {
      for (let j = 0; j < input[i].length; j++) {
        const ch = input[i][j];

        switch (ch) {
          case "#":
            walls.add(`${i},${j}`);
            break;
          case "[":
            boxes.add(`l:${i},${j}`);
            boxes.add(`r:${i},${j + 1}`);
            break;
          case "@":
            robot = [i, j];
            break;
        }
      }
    }
  }

  for (const i of instructions) {
    const np = push2(directions.get(i)!, robot, walls, boxes);
    if (np) robot = np;
  }

  for (const box of boxes) {
    const [side, coords] = box.split(":");
    const [y, x] = coords.split(",");

    if (side === "r") continue;

    p2 += 100 * Number(y) + Number(x);
  }

  return { p1, p2 };
}

export default main;
