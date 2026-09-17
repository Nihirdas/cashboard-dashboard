# cashboard-dashboard

Live test dashboard for [Cashboard](https://github.com/Nihirdas/cashboard) — the
test pyramid, pass/duration trends, per-spec status, and the test design
rationale.

**Live:** https://nihirdas.github.io/cashboard-dashboard/

Static Vite + React + Recharts site. It reads `public/data/history.json` at
runtime, so new results appear without a rebuild; CI appends a record per run.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main`.
