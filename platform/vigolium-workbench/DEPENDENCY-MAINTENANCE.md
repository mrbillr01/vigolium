# Maintenance dependency verification

Use `npm ci` for the reviewed dependency tree in `package-lock.json`. Build and test with `npm run build` and `npm test`; Bun may also execute the scripts without reinstalling dependencies.

The previous Bun lockfile was stale and is archived in `C:/Users/mrbil/logs/updateme/workbench-stale-bun.lock`. Bun 1.3.14 cannot resolve the transitive local tarball alias used for the patched braces fork, so this project now keeps one authoritative npm lockfile. The fork's source, license, mitigation description and regression tests are in `vendor/braces`. Do not regenerate a Bun lockfile until its dependency overrides can preserve the same patched tree.
