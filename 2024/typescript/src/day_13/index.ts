import { Solution } from "../index.js";

type OneDimSolution = { a: number; b: number }[];
type TwoDimSolution =
  | { type: "unique"; a: number; b: number }
  | { type: "multiple"; solutions: OneDimSolution }
  | { type: "none" };

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function solve1D(a: number, b: number, c: number): OneDimSolution {
  const g = gcd(a, b);
  if (c % g !== 0) return [];

  const a_ = a / g;
  const b_ = b / g;
  const c_ = c / g;

  const modInverse = (x: number, m: number): number | null => {
    x %= m;
    for (let i = 1; i < m; i++) if ((x * i) % m === 1) return i;
    return null;
  };

  const inv = modInverse(a_ % b_, b_);
  if (inv === null) return [];

  const a0 = (inv * (c_ % b_)) % b_;
  const b0 = (c_ - a_ * a0) / b_;

  const results: OneDimSolution = [];
  const tMin = Math.ceil(-a0 / b_);
  const tMax = Math.floor(b0 / a_);
  for (let t = tMin; t <= tMax; t++) {
    const x = a0 + b_ * t;
    const y = b0 - a_ * t;
    if (x >= 0 && y >= 0) results.push({ a: x, b: y });
  }
  return results;
}

export function solve2D(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  X: number,
  Y: number,
): TwoDimSolution {
  const D = ax * by - ay * bx;

  if (D === 0) {
    if (ax === 0 && bx === 0) return { type: "none" };
    const useY = ax === 0 && bx === 0 ? true : Math.abs(ay) > Math.abs(ax);
    const a1 = useY ? ay : ax;
    const b1 = useY ? by : bx;
    const target = useY ? Y : X;
    const solutions = solve1D(a1, b1, target);
    return solutions.length
      ? { type: "multiple", solutions }
      : { type: "none" };
  }

  const a = (X * by - Y * bx) / D;
  const b = (Y * ax - X * ay) / D;

  if (Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0)
    return { type: "unique", a, b };

  return { type: "none" };
}

function main(f: string): Solution {
  let p1 = 0;
  let p2 = 0;

  const input = f.split("\n");
  const len = input.length;

  const ak = "Button A: X+";
  const bk = "Button B: X+";
  const pk = "Prize: X=";

  for (let i = 0; i < len; i++) {
    const line = input[i];

    if (!line.startsWith(ak)) continue;
    if (!line.length) continue;

    let a, b, p;

    const [ax, ay] = input[i].replace(ak, "").replace(" Y+", "").split(",");
    a = [Number(ax), Number(ay)];
    const [bx, by] = input[i + 1].replace(bk, "").replace(" Y+", "").split(",");
    b = [Number(bx), Number(by)];
    const [px, py] = input[i + 2].replace(pk, "").replace(" Y=", "").split(",");
    p = [Number(px), Number(py)];

    const sol = solve2D(a[0], a[1], b[0], b[1], p[0], p[1]);
    const p2i = 10_000_000_000_000;
    const sol2 = solve2D(a[0], a[1], b[0], b[1], p2i + p[0], p2i + p[1]);

    if (sol.type === "unique") p1 += 1 * sol.b + 3 * sol.a;
    if (sol2.type === "unique") p2 += 1 * sol2.b + 3 * sol2.a;

    // never happened ??
    // if (sol2.type === "multiple") {
    // const sorted = sol2.solutions.sort((a, b) => a.b - b.b);
    // console.log(sorted);
    // }
  }

  return { p1, p2 };
}

export default main;
