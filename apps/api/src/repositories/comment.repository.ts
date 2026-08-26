import db from "@koemment/db";
import type { Comment, CommentWithAuthorAndVote } from "@koemment/db";

export class CommentRepository {
  async findManyByPostId(postId: string, currentUserId: string | null): Promise<CommentWithAuthorAndVote[]> {
    const comments = await db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { name: true, image: true } },
        upvotes: { where: { userId: currentUserId ?? "" } },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      score: comment.score,
      createdAt: comment.createdAt,
      parentId: comment.parentId,
      postId: comment.postId,
      author: { name: comment.user.name, image: comment.user.image },
      myVote: (comment.upvotes[0]?.value ?? null) as 1 | -1 | null,
    }));
  }

  async create(postId: string, userId: string, content: string, parentId?: string): Promise<Comment | null> {
    if (parentId) {
      const parent = await db.comment.findUnique({ where: { id: parentId } });

      if (!parent || parent.postId !== postId) {
        return null;
      }
    }

    return db.comment.create({
      data: { postId, userId, content, parentId },
    });
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const { count } = await db.comment.updateMany({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
    return count > 0;
  }
}

export const commentRepository = new CommentRepository();
