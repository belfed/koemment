# koemment

Lightweight, self-hostable, headless comment management system for blogs and social apps.

## Structure

- `apps/api` — Hono + Prisma (Postgres) backend, authentication via `better-auth`.
- `packages/koemment` — headless, framework-agnostic client for the API.

## Prerequisites

- Node.js 22+
- pnpm 11+
- Docker (for local Postgres)

## Quick start

```bash
git clone <repo-url>
cd koemment
pnpm install

cp apps/api/.env.example apps/api/.env
# edit apps/api/.env: set BETTER_AUTH_SECRET (openssl rand -base64 32)
# and, optionally, GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET for GitHub sign-in

pnpm db:up          # start Postgres in Docker
pnpm db:migrate     # apply migrations
pnpm db:seed        # create a demo post + comment

pnpm dev            # start the API on http://localhost:1000
```

## Scripts (root)

| Script            | Description                                   |
| ----------------- | ---------------------------------------------- |
| `pnpm dev`         | Run the API in watch mode                      |
| `pnpm build`       | Build all workspace packages                    |
| `pnpm test`        | Run the API test suite (requires Postgres up)   |
| `pnpm typecheck`   | Typecheck all workspace packages                |
| `pnpm db:up`       | Start the Postgres container                    |
| `pnpm db:down`     | Stop the Postgres container                     |
| `pnpm db:migrate`  | Apply Prisma migrations (dev)                   |
| `pnpm db:seed`     | Seed the database with demo data                |

## CI

`.github/workflows/ci.yaml` runs typecheck, migrations, tests, and build against a Postgres service on every push/PR to `main`.
