# api

## 0.3.0

### Minor Changes

- Add `limit`/`offset` pagination to the comment listing endpoint, capped at 200 per page, so a heavily-commented post can't return an unbounded response. `KoemmentClient.getComments` accepts an optional `{ limit, offset }` to use it.
- Rate-limit comment creation/deletion and voting to 20 requests per minute per client, to prevent spam and abuse of the mutating endpoints.

### Patch Changes

- Fail fast at startup with a clear error when a required GitHub/Google OAuth environment variable is missing, instead of silently passing `undefined` through to better-auth.
- Return a 404 instead of crashing with a raw database error when voting on a comment that doesn't exist.

## 0.2.1

### Patch Changes

- 59eef17: Allow requests from trusted origins, configured via `TRUSTED_ORIGINS`, so the published client can actually be used from a different domain (e.g. a blog or app calling the API from the browser).

## 0.2.0

### Minor Changes

- 9281b2d: Add GitHub and Google login, and require an authenticated user to vote on comments.
- 21bf56b: Add a client for reading and writing comments. Reading comments now includes the author's name and picture, and the logged-in user's own vote on each comment. Creating a comment (including replies), deleting a comment, and voting now require the user to be logged in, and a comment can only be deleted by its own author.
- b49eb47: Add an endpoint to remove a vote from a comment, decrementing its score back to what it was before the vote.

### Patch Changes

- 3ab324e: Add input validation to the comments and votes endpoints, returning a consistent error response for invalid requests.
- Updated dependencies [21bf56b]
  - @belfed/db@0.2.0
