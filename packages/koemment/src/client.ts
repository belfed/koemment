import type { Comment, KoemmentClientOptions, User } from "./types.js";

export class KoemmentClient {
  private readonly apiUrl: string;

  constructor(options: KoemmentClientOptions) {
    this.apiUrl = options.apiUrl.replace(/\/$/, "");
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Koemment request failed: ${res.status} ${body}`);
    }

    return res.json() as Promise<T>;
  }

  // --- Auth -----------------------------------------------------------

  async login(provider: "github"): Promise<void> {
    const { url } = await this.request<{ url: string }>("/api/auth/sign-in/social", {
      method: "POST",
      body: JSON.stringify({ provider, callbackURL: window.location.href }),
    });
    window.location.href = url;
  }

  async logout(): Promise<void> {
    await this.request<void>("/api/auth/sign-out", { method: "POST" });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await this.request<{ user: User } | null>("/api/auth/get-session");
      return session?.user ?? null;
    } catch {
      return null;
    }
  }

  // --- Comments ---------------------------------------------------------

  getComments(postId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/posts/${encodeURIComponent(postId)}/comments`);
  }

  postComment(postId: string, text: string, parentId?: string): Promise<Comment> {
    return this.request<Comment>(`/posts/${encodeURIComponent(postId)}/comments`, {
      method: "POST",
      body: JSON.stringify({ text, parentId }),
    });
  }

  editComment(commentId: string, text: string): Promise<Comment> {
    return this.request<Comment>(`/comments/${encodeURIComponent(commentId)}`, {
      method: "PATCH",
      body: JSON.stringify({ text }),
    });
  }

  deleteComment(commentId: string): Promise<void> {
    return this.request<void>(`/comments/${encodeURIComponent(commentId)}`, {
      method: "DELETE",
    });
  }
}
