import "dotenv/config";
import { afterAll, describe, expect, it } from "vitest";

import { comments } from "./comments.js";
import { posts } from "./posts.js";
import { db } from "../db/index.js";

describe("comment lifecycle", () => {
  const postId = "test-post-pattern-example";

  afterAll(async () => {
    await db.comment.deleteMany({ where: { postId } });
    await db.post.delete({ where: { id: postId } });
  });

  it("should sync posts, create a comment, and read it back", async () => {
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

    const getRes = await comments.request(`/posts/${postId}/comments`);
    const body = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].textMd).toBe("hello");
  });
});
