# Local braces security fork

Source: MIT-licensed micromatch/braces 3.0.3, copied from the installed npm package.
Original index/lib source and LICENSE are retained. This is a local fork, not an upstream release.

GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 has no published patched version as of 2026-10-10:
https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

Changes: reject parser nesting over 100 before pushing onto its stack; iteratively
validate AST depth, node count and cycles before compile, expand and stringify.
The limits cannot be disabled through caller options. Ordinary glob behavior and
existing expansion range limits are retained. Extremely deep patterns now throw
a controlled SyntaxError instead of exhausting the process stack.

The package identifies itself as @mrbil/braces-depth-guard, version 3.0.3-mrbil.1.
The npm override installs this fork wherever a transitive dependency asks for
braces. npm audit does not assess this unpublished fork; the security tests and
application build/test checks provide the evidence for this local mitigation.
Replace the override with an upstream fixed release when available.

Run `node --test vendor/braces/security.test.cjs` from the project root.
