# specurity-e2e

Throwaway target repository for Specurity end-to-end tests (GitHub connection, webhooks, PR-merge auto re-test).
**Deliberately vulnerable — never deploy.**

- `src/server.js` — a tiny login API with a SQL injection in `POST /login` (the issue the E2E flow reports).
- A pull request from a branch named after the Specurity issue key (e.g. `fix/CHE-1`) fixes it; merging it should
  make Specurity start an AI re-test automatically.
