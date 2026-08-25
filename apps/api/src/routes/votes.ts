import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { voteRepository } from "../repositories/vote.repository.js";

const userId = "dummy";

export const votes = new Hono();

const commentIdParamSchema = z.object({ commentId: z.string().min(1) });
const voteBodySchema = z.object({ value: z.union([z.literal(1), z.literal(-1)]) });

votes.post(
  "/comments/:commentId/votes",
  zValidator("param", commentIdParamSchema),
  zValidator("json", voteBodySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Value must be 1 or -1" }, 400);
    }
  }),
  async (c) => {
    const { commentId } = c.req.valid("param");
    const { value } = c.req.valid("json");

    const { vote, created } = await voteRepository.upsert(commentId, userId, value);

    return c.json(vote, created ? 201 : 200);
  },
);

votes.delete("/comments/:commentId/votes", zValidator("param", commentIdParamSchema), async (c) => {
  const { commentId } = c.req.valid("param");

  const deleted = await voteRepository.remove(commentId, userId);

  if (!deleted) {
    return c.json({ error: "Vote not found" }, 404);
  }

  return c.body(null, 204);
});
