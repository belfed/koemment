import { Hono } from "hono";

import { db } from "../db/index.js";

export const votes = new Hono();

votes.put("/comments/:commentId/votes", async (c) => {
  const commentId = c.req.param("commentId");
  const body = await c.req.json<{ value: number }>();

  if (body.value !== 1 && body.value !== -1) {
    return c.json({ error: "value must be 1 or -1" }, 400);
  }

  const comment = await db.comment.findUnique({ where: { id: commentId } });

  if (!comment || comment.deletedAt) {
    return c.json({ error: "Comment not found" }, 404);
  }

  const userId = "temp-user-id";
  const existingVote = await db.vote.findUnique({
    where: { commentId_userId: { commentId, userId } }
  });
  const scoreDelta = existingVote ? body.value - existingVote.value : body.value;

  const [vote] = await db.$transaction([
    db.vote.upsert({
      where: { commentId_userId: { commentId, userId } },
      create: { commentId, userId, value: body.value },
      update: { value: body.value }
    }),
    db.comment.update({
      where: { id: commentId },
      data: { score: { increment: scoreDelta } }
    })
  ]);

  return c.json(vote, existingVote ? 200 : 201);
});

votes.delete("/comments/:commentId/votes", async (c) => {
  const commentId = c.req.param("commentId");
  const userId = "temp-user-id";

  const existingVote = await db.vote.findUnique({
    where: { commentId_userId: { commentId, userId } }
  });

  if (!existingVote) {
    return c.json({ error: "Vote not found" }, 404);
  }

  await db.$transaction([
    db.vote.delete({ where: { commentId_userId: { commentId, userId } } }),
    db.comment.update({
      where: { id: commentId },
      data: { score: { decrement: existingVote.value } }
    })
  ]);

  return c.body(null, 204);
});
