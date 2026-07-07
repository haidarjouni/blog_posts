import { getPosts } from "../../api/posts";
import type { PostRead } from "../../types/post";
export type HomeLoaderData = {
  posts: PostRead[];
};
export async function homeLoader(): Promise<HomeLoaderData> {
  const posts = await getPosts();

  return { posts };
}
