# api

## 0.2.0

### Minor Changes

- 9281b2d: Add GitHub and Google login, and require an authenticated user to vote on comments.
- 21bf56b: Add a client for reading and writing comments. Reading comments now includes the author's name and picture, and the logged-in user's own vote on each comment. Creating a comment (including replies), deleting a comment, and voting now require the user to be logged in, and a comment can only be deleted by its own author.
- b49eb47: Add an endpoint to remove a vote from a comment, decrementing its score back to what it was before the vote.

### Patch Changes

- 3ab324e: Add input validation to the comments and votes endpoints, returning a consistent error response for invalid requests.
- Updated dependencies [21bf56b]
  - @belfed/db@0.2.0
