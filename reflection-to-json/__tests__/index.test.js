const { exec } = require("child_process");
const outputJson = require("./data/output/helloworld.json");

function executeScript(scriptToExecute, ...args) {
  return new Promise((resolve, reject) => {
    exec(`${scriptToExecute} ${args.join(" ")}`, (error, stdout, _stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

describe("index", () => {
  const scriptToExecute = "node bin/index.js";

  test("CLI outputs correctly - file", async () => {
    const result = await executeScript(
      scriptToExecute,
      "__tests__/data/reflection/helloworld-reflection.bin",
    );

    expect(JSON.parse(result)).toStrictEqual(outputJson);
  });

  test("CLI outputs error - not a proto reflection file", async () => {
    const promise = executeScript(
      scriptToExecute,
      "__tests__/data/output/helloworld.json",
    );

    expect(promise).rejects.toThrow();
  });

  test("CLI outputs error - no argument provided", async () => {
    const promise = executeScript(scriptToExecute);

    expect(promise).rejects.toThrow();
  });
});
