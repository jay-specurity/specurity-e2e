// Deliberately vulnerable demo app for Specurity E2E tests — never deploy.
const express = require('express');
const Database = require('better-sqlite3');

const db = new Database(':memory:');
db.exec("CREATE TABLE users (email TEXT, password TEXT); INSERT INTO users VALUES ('admin@acme.test', 's3cret!');");

const app = express();
app.use(express.json());

// Fixed (REAL-1): parameterised query — input can no longer change the SQL.
app.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string')
    return res.status(400).json({ ok: false, error: 'email and password are required' });
  const row = db
    .prepare('SELECT email FROM users WHERE email = ? AND password = ?')
    .get(String(email ?? ''), String(password ?? ''));
  return row ? res.json({ ok: true, user: row.email }) : res.status(401).json({ ok: false });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT ?? 3000);
