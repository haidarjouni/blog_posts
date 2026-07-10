import { redirect } from "react-router-dom";
import { createComment, createPost, deleteComment, deletePost, updateComment, updatePost } from "../../api/posts";
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

export async function updatePostAction({ request, params }: { request: Request; params: { id?: string } }): Promise<Response> {
     if(!params.id){
          throw new Error("Post ID is required");
     }

     const formData = await request.formData();
     const title = String(formData.get("title") || "");
     const content = String(formData.get("content") || "");
     const categoryId = Number(formData.get("category_id") || 0);
     const status = String(formData.get("status") || "");
     const tags = formData.getAll("tags").map((tag) => Number(tag));

     const post = await updatePost(Number(params.id), {
          title,
          content,
          category_id: categoryId,
          status,
          tags,
     });

     return redirect(`/posts/${post.id}`);
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
          case "update-comment":
               const editedCommentId = String(formData.get("comment_id")|| "");
               const editedContent = String(formData.get("content")|| "");
               if(!editedCommentId){
                    throw new Error("Comment ID is required");
               }
               await updateComment(Number(editedCommentId), {
                    content: editedContent,
               });
               return redirect(`/posts/${params.id}`);
          case "delete-post":
               const postId = String(formData.get("post_id")|| "");
               if(!postId){
                    throw new Error("Post ID is required");
               }
               await deletePost(Number(postId));
               return redirect(`/`);
          default:
               throw new Error("Unknown action");
     }
}
