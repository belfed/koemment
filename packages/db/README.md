# @belfed/db

Prisma schema, generated client, and the Prisma singleton shared across the koemment monorepo.

This package is `private` and is never published — it exists only to be consumed as a workspace
dependency by [`apps/api`](../../apps/api) (the real runtime client) and
[`packages/koemment`](../koemment) (type-only, so the published client's types stay in sync with
the API without duplicating them).

See [AGENTS.md](./AGENTS.md) for the rules around changing the schema and regenerating the client.
