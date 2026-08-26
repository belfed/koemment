TypeScript Hono application + Prisma v7 + better-auth.

All the following instructions are valid throughout the `api` module:

# TypeScript instructions
- TypeScript configurations MUST import the root configuration and ONLY tweak it when needed. NEVER change the root `tsconfig.base.json` unless specified otherwise.
- NEVER use `any`, always type variables and functions beforehand.
- NEVER create duplicate types: ALWAYS use Prisma generated types whenever possible or partial versions of them if needed.

# Hono instructions
- ALWAYS use separated files for routes for each entity and for auth routes, except for technical endpoints (e.g. `/health`).
- ALWAYS validate endpoint parameters and body with `zod`. NEVER duplicate types for schema validation, use Prisma generated types whenever possible or partial versions of them if needed.
- NEVER do queries in a route handler: ALWAYS use the entity repository.

# Entity repository instructions
- ALWAYS create a repository for each entity.
- Each repository MUST have an instance class `<Entity>Repository` with conventional methods, according to the needs (e.g. `findById(id: string)` is not always needed).

# Prisma instructions
- The Prisma schema, generated client, and singleton live in the `@belfed/db` package (`packages/db`), shared with `packages/koemment`. See `packages/db/AGENTS.md` for its own rules (never hand-edit generated files, always regenerate after schema changes).
- ALWAYS use the Prisma singleton exported from `@belfed/db` for queries.
- ALWAYS use Prisma transactions for dependent queries.
- ALWAYS get the query result (for SELECT, INSERT, UPDATE, DELETE, UPSERT) whenever possible to ensure the correctness of the query.

# Code instructions
- ALWAYS sort imports in this order, leaving a blank row between each section:
    1. Local configurations (e.g. `dotenv`)
    2. Third-party imports
    3. Local imports:
        1. Repositories
        2. Utils
- NEVER write `if` conditions to ensure that a value only is one of a set of specific values in a chained manner, e.g. `if(a === 1 || a === 2 || a === 3)`. Prefer inline arrays, e.g. `if([1, 2, 3].includes(a))`
- NEVER use `try-catch` blocks to swallow errors, unless otherwise specified.