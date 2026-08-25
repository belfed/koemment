import db from "../db/db.js";
import type { Comment } from "../generated/prisma/client.js";

export class CommentRepository {
  findManyByPostId(postId: string): Promise<Comment[]> {
    return db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    const { count } = await db.comment.updateMany({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return count > 0;
  }
}

export const commentRepository = new CommentRepository();
