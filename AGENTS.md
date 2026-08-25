`pnpm` workspace with `/apps` and `/packages` as modules folders.

All the following instructions are valid throughout the entire repository:

# Git instructions
- Always use conventional commits.
- Versioning is managed with Changesets, not manual bumps: run `pnpm changeset` and commit the generated file alongside any change to a package, describing the affected package(s) and bump type (patch/minor/major). Actual `package.json` version bumps and changelogs are produced later by `pnpm version-packages` (`changeset version`), not per-commit.

# Vitest instructions
- Each module uses `vitest` for testing.
- Each test has its fresh db transaction, rolled back at the end.