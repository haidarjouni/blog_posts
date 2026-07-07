import { redirect } from "react-router-dom";
import { createComment, createPost, deleteComment } from "../../api/posts";
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

export async function createCommentAction({request,params}: {request: Request; params: { id?: string };}): Promise<Response> {
     const formData = await request.formData();
     switch(String(formData.get("intent") || "")){
          case "create-comment":
               const content = String(formData.get("content")|| "");
               if(!params.id){
                    throw new Error("Post ID is required");
               }
               await createComment(Number(params.id), {
                    content,
               });
               return redirect(`/posts/${params.id}`);
          case "delete-comment":
               const commentId = String(formData.get("comment_id")|| "");
               if(!commentId){
                    throw new Error("Comment ID is required");
               }
               await deleteComment(Number(commentId));
               return redirect(`/posts/${params.id}`);
          default:
               throw new Error("Unknown action");
     }
}