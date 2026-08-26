import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { getOptionalUser, requireAuth } from "../middleware/require-auth.js";
import { commentRepository } from "../repositories/comment.repository.js";

export const comments = new Hono();

const postIdParamSchema = z.object({ postId: z.string().min(1) });
const commentIdParamSchema = z.object({ commentId: z.string().min(1) });
const createCommentBodySchema = z.object({
  content: z.string().min(1),
  parentId: z.string().min(1).optional(),
});
const listCommentsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional().default(100),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

comments.get(
  "/posts/:postId/comments",
  zValidator("param", postIdParamSchema),
  zValidator("query", listCommentsQuerySchema),
  async (c) => {
    const { postId } = c.req.valid("param");
    const { limit, offset } = c.req.valid("query");
    const user = await getOptionalUser(c.req.raw.headers);

    const result = await commentRepository.findManyByPostId(postId, user?.id ?? null, limit, offset);

    return c.json(result);
  },
);

comments.post(
  "/posts/:postId/comments",
  requireAuth,
  zValidator("param", postIdParamSchema),
  zValidator("json", createCommentBodySchema),
  async (c) => {
    const { postId } = c.req.valid("param");
    const { content, parentId } = c.req.valid("json");
    const { id: userId } = c.get("user");

    const comment = await commentRepository.create(postId, userId, content, parentId);

    if (!comment) {
      return c.json({ error: "Parent comment not found on this post" }, 400);
    }

    return c.json(comment, 201);
  },
);

comments.delete(
  "/comments/:commentId",
  requireAuth,
  zValidator("param", commentIdParamSchema),
  async (c) => {
    const { commentId } = c.req.valid("param");
    const { id: userId } = c.get("user");

    const deleted = await commentRepository.softDelete(commentId, userId);

    if (!deleted) {
      return c.json({ error: "Comment not found" }, 404);
    }

    return c.body(null, 204);
  },
);
