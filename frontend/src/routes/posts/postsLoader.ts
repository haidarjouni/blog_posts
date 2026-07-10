import { getCategories } from "../../api/categories";
import { getPostById } from "../../api/posts";
import { getTags } from "../../api/tags";
import { requireUser } from "../../auth/guards";
import type { CategoryRead } from "../../types/category";
import type { PostDetail } from "../../types/post";
import type { TagRead } from "../../types/tag";
export type CreatePostLoaderData  = {
    categories: CategoryRead[];
    tags: TagRead[];
}
export type PostDetailLoaderData = {
    post: PostDetail;
}
export type EditPostLoaderData = {
     post: PostDetail;
     categories: CategoryRead[];
     tags: TagRead[];
}
export async function createPostLoader(): Promise<CreatePostLoaderData > {
     const categories = await getCategories();
     const tags = await getTags();
     return {
          categories,
          tags
     }
}

export async function getPostByIdLoader({ params }: { params: { id?: string } }): Promise<PostDetailLoaderData> {
     if(!params.id){
          throw new Error("Post ID is required");
     }

     const post = await getPostById(Number(params.id));
     
     return { post };
}

export async function editPostLoader({ params }: { params: { id?: string } }): Promise<EditPostLoaderData> {
     if(!params.id){
          throw new Error("Post ID is required");
     }

     const user = await requireUser();
     const post = await getPostById(Number(params.id));

     if(user.id !== post.author.id && !user.is_admin){
          throw new Error("You are not authorized to edit this post");
     }

     const categories = await getCategories();
     const tags = await getTags();

     return { post, categories, tags };
}
