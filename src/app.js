const http = require('node:http');

function createApp() {
  let items = [];
  let nextId = 1;

  const send = (res, status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(body === undefined ? '' : JSON.stringify(body));
  };

  const readJson = (req) =>
    new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
        if (data.length > 1e6) reject(new Error('payload too large'));
      });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          reject(new Error('invalid json'));
        }
      });
    });

  const validName = (name) => typeof name === 'string' && name.trim().length > 0;

  return http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    const match = pathname.match(/^\/items(?:\/(\d+))?$/);

    if (req.method === 'GET' && pathname === '/health') {
      return send(res, 200, { status: 'ok' });
    }
    if (!match) return send(res, 404, { error: 'not found' });

    const id = match[1] ? Number(match[1]) : null;
    const item = id ? items.find((i) => i.id === id) : null;

    try {
      if (!id && req.method === 'GET') return send(res, 200, items);

      if (!id && req.method === 'POST') {
        const { name, quantity = 1 } = await readJson(req);
        if (!validName(name) || !Number.isInteger(quantity) || quantity < 1) {
          return send(res, 400, { error: 'name (string) y quantity (entero >= 1) son requeridos' });
        }
        const created = { id: nextId++, name: name.trim(), quantity, bought: false };
        items.push(created);
        return send(res, 201, created);
      }

      if (id && !item) return send(res, 404, { error: 'item not found' });

      if (id && req.method === 'GET') return send(res, 200, item);

      if (id && req.method === 'PUT') {
        const { name, quantity, bought } = await readJson(req);
        if (name !== undefined) {
          if (!validName(name)) return send(res, 400, { error: 'name inválido' });
          item.name = name.trim();
        }
        if (quantity !== undefined) {
          if (!Number.isInteger(quantity) || quantity < 1) return send(res, 400, { error: 'quantity inválido' });
          item.quantity = quantity;
        }
        if (bought !== undefined) {
          if (typeof bought !== 'boolean') return send(res, 400, { error: 'bought inválido' });
          item.bought = bought;
        }
        return send(res, 200, item);
      }

      if (id && req.method === 'DELETE') {
        items = items.filter((i) => i.id !== id);
        return send(res, 204);
      }

      return send(res, 405, { error: 'method not allowed' });
    } catch (err) {
      return send(res, 400, { error: err.message });
    }
  });
}

module.exports = { createApp };
