import type { UserPublic } from "./user";
export type CommentRead = {
     id: number;
     author: UserPublic;
     content: string;
     created_at: string;
}

export type CommentCreate = {
     content: string;
}

export type CommentUpdate = Partial<CommentCreate>;
