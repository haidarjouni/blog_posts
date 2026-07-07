import { getPosts } from "../../api/posts";
import type { Posts } from "../../types/post";
export type HomeLoaderData = {
  posts: Posts;
};
export async function homeLoader(): Promise<HomeLoaderData> {
  const posts = await getPosts();

  return { posts };
}
