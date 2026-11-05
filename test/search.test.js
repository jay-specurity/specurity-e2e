// GA-6: product search must treat the search text as text, never as SQL.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');

let server;
let base;
before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const search = async (q) => {
  const res = await fetch(`${base}/api/products?search=${encodeURIComponent(q)}`);
  return { status: res.status, body: await res.json() };
};

test('a normal search finds products', async () => {
  const { status, body } = await search('lamp');
  assert.strictEqual(status, 200);
  assert.deepStrictEqual(body.products.map((p) => p.name), ['Desk lamp', 'Floor lamp']);
});

test('UNION injection returns no user data', async () => {
  const { status, body } = await search("zz' UNION SELECT id, email, password FROM users--");
  assert.strictEqual(status, 200);
  assert.deepStrictEqual(body.products, []);
  assert.doesNotMatch(JSON.stringify(body), /acme\.test|s3cret/);
});

test('a tautology does not widen the search', async () => {
  const { body } = await search("zzzz' OR '1'='1");
  assert.deepStrictEqual(body.products, []);
});

test('LIKE wildcards in the text match themselves', async () => {
  assert.deepStrictEqual((await search('%')).body.products, []);
  assert.deepStrictEqual((await search('_')).body.products, []);
});

test('quotes and brackets never surface a database error', async () => {
  const { status, body } = await search('a\'")(');
  assert.strictEqual(status, 200);
  assert.doesNotMatch(JSON.stringify(body), /SQLITE|syntax|near "/i);
});
