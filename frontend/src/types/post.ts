import type { UserRead } from "../types/user";
import type { CategoryRead } from "../types/category";
import type { TagRead } from "../types/tag";
import type { CommentRead } from "../types/comment";
export type Post = {
  id: number;
  author: UserRead;
  title: string;
  content: string;
  status: string;
  category: CategoryRead;
  tags: TagRead[];
  created_at: string;
};
export type PostDetail = Post & {
  comments: CommentRead[];
};

export type PostCreate = {
  title: string;
  content: string;
  category_id: number;
  status: string;
  tags: number[];
};

export type Posts = Post[];