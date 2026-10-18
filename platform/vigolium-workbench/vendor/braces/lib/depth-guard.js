'use strict';

// Bound recursion before any recursive walker sees a caller-supplied AST.
// Parent/prev links intentionally do not participate in traversal.
module.exports = ast => {
  const pending = [[ast, 0]];
  const seen = new Set();
  let count = 0;
  while (pending.length) {
    const [node, depth] = pending.pop();
    if (!node || typeof node !== 'object') continue;
    if (depth > 100 || seen.has(node) || ++count > 65536) {
      throw new SyntaxError('Brace AST exceeds safe traversal limits');
    }
    seen.add(node);
    if (Array.isArray(node.nodes)) {
      for (const child of node.nodes) pending.push([child, depth + 1]);
    }
  }
};
