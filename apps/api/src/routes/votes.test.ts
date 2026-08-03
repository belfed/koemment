import "dotenv/config";
import { afterAll, describe, expect, it } from "vitest";

import { comments } from "./comments.js";
import { posts } from "./posts.js";
import { votes } from "./votes.js";
import { db } from "../db/index.js";

describe("vote lifecycle", () => {
  const postId = "test-post-vote-pattern-example";
  let commentId: string;

  afterAll(async () => {
    await db.vote.deleteMany({ where: { comment: { postId } } });
    await db.comment.deleteMany({ where: { postId } });
    await db.post.delete({ where: { id: postId } });
  });

  it("should sync posts and create a comment to vote on", async () => {
    const syncRes = await posts.request("/posts/sync", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.SYNC_TOKEN}`
      },
      body: JSON.stringify({ posts: [{ id: postId }] })
    });

    expect(syncRes.status).toBe(200);

    const createRes = await comments.request(`/posts/${postId}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "hello" })
    });

    expect(createRes.status).toBe(201);

    const created = await createRes.json();
    commentId = created.id;
  });

  it("should upvote the comment and increment its score", async () => {
    const voteRes = await votes.request(`/comments/${commentId}/votes`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: 1 })
    });

    expect(voteRes.status).toBe(201);

    const comment = await db.comment.findUnique({ where: { id: commentId } });
    expect(comment?.score).toBe(1);
  });

  it("should change the vote to a downvote and adjust the score", async () => {
    const voteRes = await votes.request(`/comments/${commentId}/votes`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: -1 })
    });

    expect(voteRes.status).toBe(200);

    const comment = await db.comment.findUnique({ where: { id: commentId } });
    expect(comment?.score).toBe(-1);
  });

  it("should remove the vote and restore the score", async () => {
    const deleteRes = await votes.request(`/comments/${commentId}/votes`, {
      method: "DELETE"
    });

    expect(deleteRes.status).toBe(204);

    const comment = await db.comment.findUnique({ where: { id: commentId } });
    expect(comment?.score).toBe(0);
  });
});
