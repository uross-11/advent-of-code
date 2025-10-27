import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Solution = { p1: number; p2: number };

const modules: {
  [key: string]: (file: string) => Solution;
} = {};

async function importAll(): Promise<void> {
  for (let i = 1; i <= 25; i++) {
    const day = i.toString().padStart(2, "0");

    try {
      const m = await import(`./day_${day}/index.js`);
      modules[`day_${day}`] = m.default || m;
    } catch (error) {
      console.error(`Failed to import day_${day}`);
    }
  }
}

const args = process.argv.slice(2);

async function runAll(): Promise<void> {
  try {
    await importAll();

    const test = args[0] === "--test=true";

    for (const [day, func] of Object.entries(modules)) {
      const file = readFileSync(
        join(process.cwd(), `src/${day}/${test ? "test" : "input"}`),
        "utf8",
      ).trim();

      if (typeof func === "function") {
        console.time(day);
        const { p1, p2 } = func(file);
        console.timeEnd(day);

        console.log(`- p1: ${p1}\n- p2: ${p2}\n`);
      } else {
        console.warn("Skipping non-function module:", func);
      }
    }
  } catch (error) {
    console.error("An error occurred while importing modules:", error);
  }
}

runAll();
