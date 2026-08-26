import type { Comment, CommentWithAuthorAndVote, Vote } from "@koemment/db";

async function throwIfError(res: Response): Promise<void> {
  if (res.ok) return;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? `Request failed with status ${res.status}`);
}

export class KoemmentClient {
  constructor(private readonly baseUrl: string) {}

  async getComments(postId: string): Promise<CommentWithAuthorAndVote[]> {
    const res = await fetch(`${this.baseUrl}/posts/${postId}/comments`, {
      credentials: "include",
    });
    await throwIfError(res);
    return (await res.json()) as CommentWithAuthorAndVote[];
  }

  async createComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    const res = await fetch(`${this.baseUrl}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content, parentId }),
    });
    await throwIfError(res);
    return (await res.json()) as Comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });
    await throwIfError(res);
  }

  async vote(commentId: string, value: 1 | -1): Promise<Vote> {
    const res = await fetch(`${this.baseUrl}/comments/${commentId}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ value }),
    });
    await throwIfError(res);
    return (await res.json()) as Vote;
  }

  async removeVote(commentId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/comments/${commentId}/votes`, {
      method: "DELETE",
      credentials: "include",
    });
    await throwIfError(res);
  }
}
