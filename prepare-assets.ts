import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";

(async () => {
  const files = await readdir("./src/assets/", { recursive: true });
  for (const file of files) {
    await mkdir("src/svgs", { recursive: true });
    const nextFileName = `src/svgs/${file}.ts`;
    const svgText = await readFile(`src/assets/${file}`, { encoding: "utf8" });
    await writeFile(nextFileName, `const content = \`${svgText}\`;\nexport default content;`, { encoding: "utf8" });
  }
})();
