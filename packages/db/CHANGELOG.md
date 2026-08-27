# @belfed/db

## 0.2.1

### Patch Changes

- Add a one-shot `migrate` docker-compose service (new `migrator` Dockerfile target running `prisma migrate deploy`) that the `api` container now waits on before starting, so pending schema migrations are always applied on deploy instead of silently never running.

## 0.2.0

### Minor Changes

- 21bf56b: Add a client for reading and writing comments. Reading comments now includes the author's name and picture, and the logged-in user's own vote on each comment. Creating a comment (including replies), deleting a comment, and voting now require the user to be logged in, and a comment can only be deleted by its own author.
