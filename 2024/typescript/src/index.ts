const modules: {
  [key: string]: any;
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

    for (const func of Object.values(modules)) {
      if (typeof func === "function") {
        func(test);
      } else {
        console.warn("Skipping non-function module:", func);
      }
    }
  } catch (error) {
    console.error("An error occurred while importing modules:", error);
  }
}

runAll();
