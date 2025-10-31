import { Solution } from "../index.js";

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const uniqueLocations1 = new Set<string>();
  const uniqueLocations2 = new Set<string>();

  const nodes = new Map<string, [number, number][]>();

  const file = f.split("\n");
  for (let i = 0; i < file.length; i++) {
    const line = file[i];
    const lineLen = line.length;

    for (let j = 0; j < lineLen; j++) {
      if (line[j] === ".") continue;

      if (!nodes.has(line[j])) {
        nodes.set(line[j], [[i, j]]);
      } else {
        nodes.set(line[j], [...nodes.get(line[j])!, [i, j]]);
      }
    }
  }

  for (const node of nodes.values()) {
    for (let i = 0; i < node.length - 1; i++) {
      for (let j = 1; j < node.length; j++) {
        if (i === j) continue;

        const diffX = node[j][0] - node[i][0];
        const diffY = node[j][1] - node[i][1];

        const antiNodes1 = [
          [node[i][0] - diffX, node[i][1] - diffY],
          [node[j][0] + diffX, node[j][1] + diffY],
        ];

        for (const an of antiNodes1) {
          const inBounds =
            an[0] >= 0 &&
            an[0] < file.length &&
            an[1] >= 0 &&
            an[1] < file[0].length;

          if (inBounds) uniqueLocations1.add(an.join(","));
        }

        const addAntinode = (x: number, y: number) => {
          if (x >= 0 && x < file.length && y >= 0 && y < file[0].length) {
            uniqueLocations2.add(`${x},${y}`);
            return true;
          }
          return false;
        };

        addAntinode(node[i][0], node[i][1]);
        addAntinode(node[j][0], node[j][1]);

        let forwardX = node[j][0] + diffX;
        let forwardY = node[j][1] + diffY;
        while (addAntinode(forwardX, forwardY)) {
          forwardX += diffX;
          forwardY += diffY;
        }

        let backwardX = node[i][0] - diffX;
        let bacwardY = node[i][1] - diffY;
        while (addAntinode(backwardX, bacwardY)) {
          backwardX -= diffX;
          bacwardY -= diffY;
        }
      }
    }
  }

  p1 = uniqueLocations1.size;
  p2 = uniqueLocations2.size;

  return { p1, p2 };
}

export default main;
