import type { Comment, CommentWithAuthorAndVote, Session, User, Vote } from "@belfed/db";

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

  async signInWithGithub(callbackURL: string = window.location.href): Promise<void> {
    await this.signInWithSocialProvider("github", callbackURL);
  }

  async signInWithGoogle(callbackURL: string = window.location.href): Promise<void> {
    await this.signInWithSocialProvider("google", callbackURL);
  }

  private async signInWithSocialProvider(provider: "github" | "google", callbackURL: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/auth/sign-in/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ provider, callbackURL }),
    });
    await throwIfError(res);
    const { url } = (await res.json()) as { url: string };
    window.location.href = url;
  }

  async signOut(): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/auth/sign-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({}),
    });
    await throwIfError(res);
  }

  async getSession(): Promise<{ user: User; session: Session } | null> {
    const res = await fetch(`${this.baseUrl}/api/auth/get-session`, {
      credentials: "include",
    });
    await throwIfError(res);
    return (await res.json()) as { user: User; session: Session } | null;
  }
}
