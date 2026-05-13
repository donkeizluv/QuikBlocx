import { build, context } from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const watchMode = process.argv.includes("--watch");
const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");

async function copyPublicAssets() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  await cp(publicDir, distDir, { recursive: true });
}

const buildOptions = {
  entryPoints: {
    background: "src/background.ts",
    content: "src/content.ts",
    options: "src/options.ts",
    popup: "src/popup.ts"
  },
  bundle: true,
  format: "esm",
  outdir: "dist",
  target: "chrome120",
  sourcemap: true,
  logLevel: "info"
};

if (watchMode) {
  await copyPublicAssets();
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log("Watching TypeScript sources. Re-run the command if you change files in public/.");
} else {
  await copyPublicAssets();
  await build(buildOptions);
}
