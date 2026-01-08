import {build} from "bun";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";

async function runBuild() {
  console.log("Building single-file application...");

  try {
    await rm("dist", { recursive: true, force: true });
  } catch {}
  await mkdir("dist", { recursive: true });

  const buildResult = await build({
    entrypoints: ["./src/main.ts"],
    minify: true,
    target: "browser",
  });

  if (!buildResult.success) {
    console.error("Build failed:", buildResult.logs);
    process.exit(1);
  }
  
  const jsContent = await buildResult.outputs[0].text();

  const cssContent = await readFile("./src/styles/main.css", "utf-8");

  let html = await readFile("./index.html", "utf-8");
  const styleTag = `<style>\n${cssContent}\n</style>`;
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]*"[^>]*>/, styleTag);

  const scriptTag = `<script type="module">\n${jsContent}\n</script>`;
  html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/, scriptTag);

  await writeFile("dist/index.html", html);
  
  console.log("Build complete! Output: dist/index.html");
}

runBuild();
