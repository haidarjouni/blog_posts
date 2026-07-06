import type { UserRead } from "../types/user";
import type { Category } from "../types/category";
import type { TagRead } from "../types/tag";

export type Post = {
  id: number;
  author: UserRead;
  title: string;
  content: string;
  status: string;
  category: Category;
  tags: TagRead[];
  created_at: string;
};



export type Posts = Post[];