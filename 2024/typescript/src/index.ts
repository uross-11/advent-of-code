import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Solution = { p1: number; p2: number };

const modules: {
  [day: string]: (file: string) => Solution;
} = {};

async function importAll(): Promise<void> {
  for (let i = 1; i <= 25; i++) {
    const day = i.toString().padStart(2, "0");

    try {
      const m = await import(`./day_${day}/index.js`);
      modules[`day_${day}`] = m.default || m;
    } catch {}
  }
}

const args = process.argv.slice(2);

async function runAll(): Promise<void> {
  try {
    await importAll();

    const test = args[0] === "--test=true";

    const dayArgIndex = args.findIndex((arg) => arg.startsWith("--day="));
    const dayArg =
      dayArgIndex !== -1
        ? args[dayArgIndex].split("=")[1].padStart(2, "0")
        : null;

    if (dayArg) {
      const func = modules[`day_${dayArg}`];
      if (func) {
        const file = readFileSync(
          join(process.cwd(), `src/day_${dayArg}/${test ? "test" : "input"}`),
          "utf8",
        ).trim();

        console.time(`day_${dayArg}`);
        const { p1, p2 } = func(file);
        console.timeEnd(`day_${dayArg}`);

        console.log(`- p1: ${p1}\n- p2: ${p2}\n`);
      } else {
        console.warn(`No module found for day_${dayArg}`);
      }
      return;
    }

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
