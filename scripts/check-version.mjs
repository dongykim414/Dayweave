import { readFile } from "node:fs/promises";

const readJson = async (fileName) => {
  const contents = await readFile(new URL(`../${fileName}`, import.meta.url), "utf8");
  return JSON.parse(contents);
};

const [packageJson, appJson] = await Promise.all([
  readJson("package.json"),
  readJson("app.json"),
]);

const packageVersion = packageJson.version;
const expoVersion = appJson.expo?.version;
const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

if (typeof packageVersion !== "string" || !semverPattern.test(packageVersion)) {
  throw new Error(`package.json version is not valid SemVer: ${String(packageVersion)}`);
}

if (packageVersion !== expoVersion) {
  throw new Error(
    `Version mismatch: package.json=${packageVersion}, app.json=${String(expoVersion)}`,
  );
}

console.log(`Version check passed: ${packageVersion}`);
