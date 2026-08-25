import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { commentRepository } from "../repositories/comment.repository.js";

export const comments = new Hono();

const postIdParamSchema = z.object({ postId: z.string().min(1) });
const commentIdParamSchema = z.object({ commentId: z.string().min(1) });

comments.get("/posts/:postId/comments", zValidator("param", postIdParamSchema), async (c) => {
  const { postId } = c.req.valid("param");

  const result = await commentRepository.findManyByPostId(postId);

  return c.json(result);
});

comments.delete("/comments/:commentId", zValidator("param", commentIdParamSchema), async (c) => {
  const { commentId } = c.req.valid("param");

  const deleted = await commentRepository.softDelete(commentId);

  if (!deleted) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.body(null, 204);
});
