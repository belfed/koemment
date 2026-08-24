import { Hono } from "hono";
import { db } from "../db/db.js";
import type { Comment } from "../generated/prisma/client.js";

export const comments = new Hono();

comments.get("/posts/:postId/comments", async (c) => {
  const postId = c.req.param("postId") as string;

  const result = await db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
  });

  return c.json(result);
});

comments.delete("/comments/:commentId", async (c) => {
  const commentId = c.req.param("commentId") as string;

  const { count } = await db.comment.updateMany({
    where: { id: commentId },
    data: { deletedAt: new Date() },
  });

  if (count === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.body(null, 204);
});
