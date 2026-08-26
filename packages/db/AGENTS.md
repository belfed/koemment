Prisma schema, generated client, and the Prisma singleton, shared across the monorepo.

All the following instructions are valid throughout the `db` module:

# Scope
- This package is `private` and must never be published or installed standalone — it exists only to be consumed as a workspace dependency by other packages in this monorepo (`apps/api` for the real runtime client, `packages/koemment` type-only).
- `packages/koemment` MUST depend on this package as a `devDependency`, never a regular `dependency` — its bundler (`tsdown`) externalizes regular dependencies' types, which would leak an unresolvable reference to this private package into published type declarations. Declaring it as a `devDependency` makes `tsdown` inline the needed types instead.

# Prisma instructions
- NEVER change files under `/src/generated`: those are automatically generated files and changing them will break the application.
- ALWAYS run `pnpm generate` (or `pnpm --filter @koemment/db generate`) after changing `prisma/schema.prisma`, and confirm the client actually regenerated (`prisma migrate dev` does not reliably trigger this on its own).
- ALWAYS run `pnpm build` after changing the schema or `src/index.ts` — consumers resolve the compiled `dist/` output, not the TypeScript source.
