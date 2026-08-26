# @belfed/koemment

Client for reading and writing comments via the [koemment](https://github.com/belfed/koemment) API.

## Install

```bash
npm install @belfed/koemment
```

## Usage

```ts
import { KoemmentClient } from "@belfed/koemment";

const client = new KoemmentClient("https://your-koemment-api.example.com");

// Read comments for a post (author name/image and your own vote included if you're logged in)
const comments = await client.getComments("post-123");

// Create a comment
const comment = await client.createComment("post-123", "Great post!");

// Reply to a comment
const reply = await client.createComment("post-123", "I agree!", comment.id);

// Vote on a comment
await client.vote(comment.id, 1); // upvote
await client.vote(comment.id, -1); // downvote
await client.removeVote(comment.id);

// Delete your own comment
await client.deleteComment(comment.id);
```

Every request is sent with `credentials: "include"`, so the browser's koemment session cookie is
attached automatically. `createComment`, `deleteComment`, `vote`, and `removeVote` all require the
visitor to be logged in (via GitHub or Google) with the koemment instance this client points at.
`getComments` works for anonymous visitors too — `myVote` is simply `null` on every comment when
nobody's logged in.

## Development

- Install dependencies: `pnpm install` (from the repo root)
- Run the unit tests: `pnpm test`
- Build the library: `pnpm build`
