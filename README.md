# koemment

Self-hostable comment management system.

## Structure

pnpm workspace with two folders of packages:

- [`apps/api`](apps/api) — the Hono + Prisma API server: comments (paginated), votes, GitHub/Google login via better-auth, and rate-limited mutations.
- [`packages/db`](packages/db) — `@belfed/db`, the shared Prisma schema/client. Private, internal only.
- [`packages/koemment`](packages/koemment) — [`@belfed/koemment`](https://www.npmjs.com/package/@belfed/koemment), the published client for reading and writing comments from a blog or app.

## Development

```bash
pnpm install
docker compose up -d db        # Postgres
pnpm --filter @belfed/db generate
pnpm --filter api dev
```

Each package has its own `README.md`/`AGENTS.md` with more detail.

## Deploying

`docker compose up -d` builds and runs the `api` service (see `apps/api/Dockerfile`) alongside Postgres.

## Versioning

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets):
run `pnpm changeset` alongside any change to a package, and `pnpm version-packages` to cut a release.
