const { test } = require('node:test');
const assert = require('node:assert/strict');
const braces = require('./');

test('ordinary patterns preserve compile, expansion and stringify behavior', () => {
  assert.deepEqual(braces.expand('a/{b,c}/{1..3}'), ['a/b/1', 'a/b/2', 'a/b/3', 'a/c/1', 'a/c/2', 'a/c/3']);
  assert.equal(braces.compile('a/{b,c}'), 'a/(b|c)');
  assert.equal(braces.stringify(braces.parse('a/{b,c}')), 'a/{b,c}');
  assert.deepEqual(braces.expand('{1..3}'), ['1', '2', '3']);
});

test('deep brace and parenthesis inputs are rejected before recursive traversal', () => {
  for (const [open, close] of [['{', '}'], ['(', ')']]) {
    const pattern = open.repeat(2000) + 'a,b' + close.repeat(2000);
    for (const method of ['parse', 'compile', 'expand', 'stringify']) {
      assert.throws(() => braces[method](pattern), SyntaxError);
    }
  }
});

test('caller-provided deep and cyclic ASTs are rejected by every walker', () => {
  let ast = { type: 'text', value: 'a' };
  for (let i = 0; i < 2000; i++) ast = { type: 'root', nodes: [ast] };
  const cyclic = { type: 'root', nodes: [] };
  cyclic.nodes.push(cyclic);
  for (const input of [ast, cyclic]) {
    for (const method of ['compile', 'expand', 'stringify']) {
      assert.throws(() => braces[method](input), SyntaxError);
    }
  }
});
