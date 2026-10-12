// Deliberately vulnerable demo app for Specurity E2E tests — never deploy.
const express = require('express');
const Database = require('better-sqlite3');

const db = new Database(':memory:');
db.exec("CREATE TABLE users (email TEXT, password TEXT); INSERT INTO users VALUES ('admin@acme.test', 's3cret!');");

const app = express();
app.use(express.json());

// VULNERABLE: user input concatenated into SQL (CWE-89). `' OR 1=1 --` signs in without a password.
app.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const row = db
    .prepare(`SELECT email FROM users WHERE email = '${email}' AND password = '${password}'`)
    .get();
  return row ? res.json({ ok: true, user: row.email }) : res.status(401).json({ ok: false });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT ?? 3000);
