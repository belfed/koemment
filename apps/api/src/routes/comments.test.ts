import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { comments } from "./comments.js";
import { posts } from "./posts.js";
import { db } from "../db/index.js";
import { signUpTestUser } from "../test-utils/auth.js";

describe("comment lifecycle", () => {
  const postId = "test-post-pattern-example";
  let authHeaders: { cookie: string };
  let otherAuthHeaders: { cookie: string };
  let commentId: string;

  beforeAll(async () => {
    ({ headers: authHeaders } = await signUpTestUser());
    ({ headers: otherAuthHeaders } = await signUpTestUser());
  });

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
      headers: { "content-type": "application/json", ...authHeaders },
      body: JSON.stringify({ text: "hello" })
    });

    expect(createRes.status).toBe(201);
    commentId = (await createRes.json()).id;

    const getRes = await comments.request(`/posts/${postId}/comments`);
    const body = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].textMd).toBe("hello");
  });

  it("should reject creating a comment without authentication", async () => {
    const res = await comments.request(`/posts/${postId}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "hello" })
    });

    expect(res.status).toBe(401);
  });

  it("should reject editing another user's comment", async () => {
    const res = await comments.request(`/comments/${commentId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", ...otherAuthHeaders },
      body: JSON.stringify({ text: "hijacked" })
    });

    expect(res.status).toBe(403);
  });

  it("should reject deleting another user's comment", async () => {
    const res = await comments.request(`/comments/${commentId}`, {
      method: "DELETE",
      headers: { ...otherAuthHeaders }
    });

    expect(res.status).toBe(403);
  });

  it("should allow the owner to edit their comment", async () => {
    const res = await comments.request(`/comments/${commentId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", ...authHeaders },
      body: JSON.stringify({ text: "hello edited" })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.textMd).toBe("hello edited");
    expect(body.textHtml).toBe("hello edited");
  });
});
