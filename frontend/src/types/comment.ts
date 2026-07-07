import type { UserRead } from "./user";
export type CommentRead = {
     id: number;
     author: UserRead;
     content: string;
     created_at: string;
}