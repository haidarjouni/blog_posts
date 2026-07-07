import { redirect } from "react-router-dom";
import { createPost } from "../../api/posts";
export async function createPostsAction({ request }: { request: Request }): Promise<Response> {
     const formData = await request.formData();
     const title = formData.get("title") as string;
     const content = formData.get("content") as string;
     const category_id = formData.get("category_id") as string;
     const tags = formData.getAll("tags") as string[];
     const status = formData.get("status") as string;
     const post = await createPost({
          title,
          content,
          category_id: Number(category_id),
          status,
          tags: tags.map((tag) => Number(tag)),
     });
     return redirect(`/posts/${post.id}`)
}

