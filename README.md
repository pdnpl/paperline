# Paperline

A quiet 5×5 line puzzle for the browser. Each card shows a number beside every row and column. Fill squares until the ink matches that picture, then the next card appears.

There is no account, score, timer, or server API.

## Play locally

```bash
npm install
npm test
npm run dev
```

## Deploy on Cloudflare Workers

Static assets only. After `wrangler login`:

```bash
npm run build
npx wrangler deploy
```

## Decisions

See `docs/adr`.
