# @belfed/koemment

## 0.4.0

### Minor Changes

- c99851f: Mask deleted comments in the listing response instead of returning their original content unchanged. Comments now include `isDeleted`, and `content` is `null` when `isDeleted` is `true`.

## 0.3.1

### Patch Changes

- 59e57cc: Document the comment list pagination and mutation rate limiting in the READMEs.

## 0.3.0

### Minor Changes

- Add `limit`/`offset` pagination to the comment listing endpoint, capped at 200 per page, so a heavily-commented post can't return an unbounded response. `KoemmentClient.getComments` accepts an optional `{ limit, offset }` to use it.

## 0.2.1

### Patch Changes

- Fix signInWithGithub and signInWithGoogle redirecting back to the API's own URL after login instead of where the visitor started. They now default to the current page, and accept an explicit callback URL to override it.

## 0.2.0

### Minor Changes

- 558c4c6: Add signInWithGithub, signInWithGoogle, signOut, and getSession methods to the client.

## 0.1.1

### Patch Changes

- 4232c3c: Add a real README with installation and usage instructions.

## 0.1.0

### Minor Changes

- 21bf56b: Add a client for reading and writing comments. Reading comments now includes the author's name and picture, and the logged-in user's own vote on each comment. Creating a comment (including replies), deleting a comment, and voting now require the user to be logged in, and a comment can only be deleted by its own author.
