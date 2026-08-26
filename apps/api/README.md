# api

Hono + Prisma API server for koemment: comments, votes, and GitHub/Google login via better-auth.

## Development

```bash
pnpm install
docker compose up -d db        # Postgres
pnpm --filter @belfed/db generate
pnpm --filter api dev
```

```
open http://localhost:1000/health
```

See [`.env.example`](.env.example) for the required environment variables (database connection,
`BETTER_AUTH_SECRET`/`BETTER_AUTH_URL`, `TRUSTED_ORIGINS`, and the GitHub/Google OAuth credentials).
The server fails fast at startup if a required OAuth variable is missing.

## Endpoints

- `GET /health` — liveness check.
- `ALL /api/auth/*` — better-auth (GitHub/Google sign-in, session, sign-out).
- `GET /posts/:postId/comments` — list comments for a post, oldest first. Supports `?limit=` (default
  100, max 200) and `?offset=` for pagination.
- `POST /posts/:postId/comments` — create a comment or reply (`parentId`). Requires auth.
- `DELETE /comments/:commentId` — soft-delete your own comment. Requires auth.
- `POST /comments/:commentId/votes` — upvote (`value: 1`) or downvote (`value: -1`) a comment. Requires auth.
- `DELETE /comments/:commentId/votes` — remove your vote from a comment. Requires auth.

Comment creation/deletion and voting (the four endpoints above marked "Requires auth") are
rate-limited to 20 requests per minute per client IP; going over returns `429`.
