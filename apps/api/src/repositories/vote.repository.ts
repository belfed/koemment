import db from "@belfed/db";
import type { Vote } from "@belfed/db";

export class VoteRepository {
  async upsert(commentId: string, userId: string, value: number): Promise<{ vote: Vote; created: boolean } | null> {
    return db.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({ where: { id: commentId } });

      if (!comment) {
        return null;
      }

      const existing = await tx.vote.findUnique({
        where: { commentId_userId: { commentId, userId } },
      });

      const delta = existing ? value - existing.value : value;

      const vote = await tx.vote.upsert({
        where: { commentId_userId: { commentId, userId } },
        update: { value },
        create: { commentId, userId, value },
      });

      if (delta !== 0) {
        await tx.comment.update({
          where: { id: commentId },
          data: { score: { increment: delta } },
        });
      }

      return { vote, created: !existing };
    });
  }

  async remove(commentId: string, userId: string): Promise<boolean> {
    return db.$transaction(async (tx) => {
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
  }
}

export const voteRepository = new VoteRepository();
