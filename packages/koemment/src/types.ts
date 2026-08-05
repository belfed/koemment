export interface User {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  userId: string;
  textMd: string;
  textHtml: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
}

export interface KoemmentClientOptions {
  apiUrl: string;
}