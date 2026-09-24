# ADR 0001: Client-only Vite app on Cloudflare Workers

## Status

Accepted

## Context

Paperline is a one-player puzzle that runs in the browser. It has no accounts, scores, leaderboard, or server API. The host target is Cloudflare Workers.

## Decision

The client is Vite 7 and TypeScript, with no UI framework. The board is a small DOM grid. Wrangler publishes the Vite `dist` directory as Workers static assets. Puzzle checking happens in the page.

## Consequences

Deploy is `npm run build` and `npx wrangler deploy` after a Cloudflare login. There is no Worker script and no origin API. A framework can be added later only if the UI outgrows a single page.
