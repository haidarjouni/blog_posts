import type { CommentRead } from "./comment";
import type { PostRead } from "./post";

export type UserPublic = {
     id: number;
     username: string;
     is_admin: boolean;
}

export type UserRead = UserPublic & {
     email: string;
}

export type UserCreate = {
     username: string;
     email: string;
     password: string;
}

export type UserDetail = UserPublic & {
     posts: PostRead[];
     comments: CommentRead[];
}

export type UserUpdate = Partial<Pick<UserCreate, "username" | "email">>
