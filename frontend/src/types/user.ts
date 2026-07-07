import type { CommentRead } from "./comment";
import type { PostRead } from "./post";
export type UserRead = {
     id: number;
     username: string;
     email: string;
     is_admin: boolean;
}

export type UserCreate = {
     username: string;
     email: string;
     password: string;
}

export type UserDetail = UserRead & {
     posts: PostRead[];
     comments: CommentRead[];
}