# Acme Shop (specurity-e2e)

A small demo shop API used as the target of Specurity's end-to-end tests: Specurity scans it, files what it finds,
and re-tests after a fix. **Demo only — fake data, never deploy anywhere real.**

| Endpoint | What it does |
| --- | --- |
| `GET /` | Storefront page with a search box |
| `GET /api/products?search=` | Search products by name or description |
| `GET /api/products/:id` | One product |
| `POST /login` | Sign in (`{ email, password }`) |
| `GET /openapi.json` | API description |
| `GET /health` | Health check |

Run: `npm install && npm start` (port 3000), or `docker build -t acme-shop . && docker run -p 3000:3000 acme-shop`.



