import { spawnSync } from "node:child_process";

// The sandbox integration suite requires Linux process and shell semantics.
const result = spawnSync("wsl.exe", [
  "--exec", "bash", "-lc", 'PATH="$HOME/.local/bin:$PATH" bun test',
], { stdio: "inherit" });
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
