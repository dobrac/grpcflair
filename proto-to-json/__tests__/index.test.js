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
      "__tests__/data/protos/helloworld.proto",
    );

    expect(JSON.parse(result)).toStrictEqual(outputJson);
  });

  test("CLI outputs correctly - multiple files", async () => {
    const result = await executeScript(
      scriptToExecute,
      "__tests__/data/protos/helloworld.proto",
      "__tests__/data/protos/other_protos.proto",
    );

    expect(JSON.parse(result)).toStrictEqual(outputJson);
  });

  test("CLI outputs correctly - folder - ending slash", async () => {
    const result = await executeScript(
      scriptToExecute,
      "__tests__/data/protos/",
    );

    expect(JSON.parse(result)).toStrictEqual(outputJson);
  });

  test("CLI outputs correctly - folder - no slash", async () => {
    const result = await executeScript(
      scriptToExecute,
      "__tests__/data/protos",
    );

    expect(JSON.parse(result)).toStrictEqual(outputJson);
  });

  test("CLI outputs error - not a proto file", async () => {
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

  test("CLI outputs error - invalid proto file", async () => {
    const promise = executeScript(
      scriptToExecute,
      "__tests__/data/protos-invalid/helloworld.proto",
    );

    expect(promise).rejects.toThrow();
  });
});
