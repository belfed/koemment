TypeScript package bundled with `tsdown` that exports a client for the koemment APIs.

All the following instructions are valid throughout the `koemment` module:

# Code instructions

- ALWAYS sort imports in this order, leaving a blank row between each section:
  1. Local configurations (e.g. `dotenv`)
  2. Third-party imports
  3. Local imports:
     1. Repositories
     2. Utils
- NEVER write `if` conditions to ensure that a value only is one of a set of specific values in a chained manner, e.g. `if(a === 1 || a === 2 || a === 3)`. Prefer inline arrays, e.g. `if([1, 2, 3].includes(a))`
- NEVER use `try-catch` blocks to swallow errors, unless otherwise specified.
- NEVER use brackets-less `ifs` and loops: prefer readability.
