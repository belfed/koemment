import { Hono } from "hono";

import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import type { AppEnv } from "../types.js";

export const comments = new Hono<AppEnv>();

comments.get("/posts/:postId/comments", async (c) => {
  const postId = c.req.param("postId");

  const result = await db.comment.findMany({
    where: { postId, deletedAt: null },
    orderBy: { createdAt: "asc" },
  });

  return c.json(result);
});

comments.post("/posts/:postId/comments", requireAuth, async (c) => {
  const postId = c.req.param("postId");
  const body = await c.req.json<{ text: string; parentId?: string }>();
  const user = c.get("user");

  const post = await db.post.findUnique({ where: { id: postId } });

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post.readOnly) {
    return c.json({ error: "Post is read-only" }, 403);
  }

  const [created] = await db.$transaction([
    db.comment.create({
      data: {
        postId,
        parentId: body.parentId ?? null,
        userId: user.id,
        textMd: body.text,
        textHtml: body.text,
      },
    }),
    db.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  return c.json(created, 201);
});

comments.patch("/comments/:commentId", requireAuth, async (c) => {
  const commentId = c.req.param("commentId");
  const body = await c.req.json<{ text: string }>();
  const user = c.get("user");

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });

  if (!comment || comment.deletedAt) {
    return c.json({ error: "Comment not found" }, 404);
  }

  if (comment.post?.readOnly) {
    return c.json({ error: "Post is read-only" }, 403);
  }

  const updated = await db.comment.update({
    where: { id: commentId, userId: user.id },
    data: { textMd: body.text, textHtml: body.text },
  });

  return c.json(updated);
});

comments.delete("/comments/:commentId", requireAuth, async (c) => {
  const commentId = c.req.param("commentId");
  const user = c.get("user");

  const comment = await db.comment.findUnique({ where: { id: commentId } });

  if (!comment || comment.deletedAt) {
    return c.json({ error: "Comment not found" }, 404);
  }

  await db.$transaction([
    db.comment.update({
      where: { id: commentId, userId: user.id },
      data: { deletedAt: new Date() },
    }),
    ...(comment.postId
      ? [
          db.post.update({
            where: { id: comment.postId },
            data: { commentCount: { decrement: 1 } },
          }),
        ]
      : []),
  ]);

  return c.body(null, 204);
});
