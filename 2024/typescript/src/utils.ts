import { join } from "node:path";

export function importPathFuckery(filename: string): string {
  return join(process.cwd(), filename);
}

export function printOutput(day: string, p1: number, p2: number) {
  console.log(`Day ${day}:\n - p1: ${p1}\n - p2: ${p2}`);
}
