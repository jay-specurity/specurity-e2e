// Acme Shop — demo target for Specurity end-to-end tests. Fake data only; never deploy with real data.
const express = require('express');
const Database = require('better-sqlite3');
const { seed } = require('./seed');
const openapi = require('./openapi.json');

const db = new Database(':memory:');
seed(db);

const app = express();
app.use(express.json());

app.get('/', (_req, res) =>
  res.type('html').send(`<!doctype html><title>Acme Shop</title>
<h1>Acme Shop</h1>
<form action="/api/products"><input name="search" placeholder="Search products"><button>Search</button></form>
<p><a href="/api/products?search=lamp">Lamps</a> · <a href="/openapi.json">API</a></p>`),
);

app.get('/openapi.json', (_req, res) => res.json(openapi));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Parameterised query: input can't change the SQL (fixed in REAL-1).
app.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string')
    return res.status(400).json({ ok: false, error: 'email and password are required' });
  const row = db
    .prepare('SELECT email FROM users WHERE email = ? AND password = ?')
    .get(email, password);
  return row ? res.json({ ok: true, user: row.email }) : res.status(401).json({ ok: false });
});

// Product search for the storefront: name or description contains the text.
app.get('/api/products', (req, res) => {
  const search = String(req.query.search ?? '');
  try {
    const rows = db
      .prepare(
        `SELECT id, name, price FROM products WHERE name LIKE '%${search}%' OR description LIKE '%${search}%' ORDER BY name`,
      )
      .all();
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  const row = db
    .prepare('SELECT id, name, description, price FROM products WHERE id = ?')
    .get(Number(req.params.id));
  return row ? res.json(row) : res.status(404).json({ error: 'not found' });
});

app.listen(process.env.PORT ?? 3000);
