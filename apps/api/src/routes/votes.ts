import { Hono } from "hono";
import db from "../db/db.js";

const userId = "dummy";

export const votes = new Hono();

votes.post("/comments/:commentId/votes", async (c) => {
  const commentId = c.req.param("commentId") as string;
  const { value } = await c.req.json<{ value: number }>();

  if (![-1, 1].includes(value)) {
    return c.json({ error: "Value must be 1 or -1" }, 400);
  }

  const { vote, created } = await db.$transaction(async (tx) => {
    const existing = await tx.vote.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    const delta = existing ? value - existing.value : value;

    const vote = await tx.vote.upsert({
      where: { commentId_userId: { commentId, userId } },
      update: { value: value },
      create: { commentId, userId, value: value },
    });

    if (delta !== 0) {
      await tx.comment.update({
        where: { id: commentId },
        data: { score: { increment: delta } },
      });
    }

    return { vote, created: !existing };
  });

  return c.json(vote, created ? 201 : 200);
});

votes.delete("/comments/:commentId/votes", async (c) => {
  const commentId = c.req.param("commentId") as string;

  const deleted = await db.$transaction(async (tx) => {
    const existing = await tx.vote.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    if (!existing) return false;

    await tx.vote.delete({
      where: { commentId_userId: { commentId, userId } },
    });

    await tx.comment.update({
      where: { id: commentId },
      data: { score: { decrement: existing.value } },
    });

    return true;
  });

  if (!deleted) {
    return c.json({ error: "Vote not found" }, 404);
  }

  return c.body(null, 204);
});
