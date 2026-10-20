const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let base;

before(async () => {
  server = createApp();
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const json = (method, path, body) =>
  fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

test('health responde ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('CRUD completo de items', async () => {
  let res = await json('POST', '/items', { name: 'Leche', quantity: 2 });
  assert.equal(res.status, 201);
  const created = await res.json();
  assert.deepEqual(created, { id: 1, name: 'Leche', quantity: 2, bought: false });

  res = await json('PUT', '/items/1', { bought: true });
  assert.equal((await res.json()).bought, true);

  res = await fetch(`${base}/items`);
  assert.equal((await res.json()).length, 1);

  res = await json('DELETE', '/items/1');
  assert.equal(res.status, 204);

  res = await fetch(`${base}/items/1`);
  assert.equal(res.status, 404);
});

test('rechaza datos inválidos', async () => {
  const res = await json('POST', '/items', { name: '' });
  assert.equal(res.status, 400);
});
