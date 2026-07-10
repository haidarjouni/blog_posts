import { data, redirect } from "react-router-dom";
import { createComment, createPost, deleteComment, deletePost, updateComment, updatePost } from "../../api/posts";
export async function createPostsAction({ request }: { request: Request }): Promise<Response> {
     const formData = await request.formData();
     const title = formData.get("title") as string;
     const content = formData.get("content") as string;
     const category_id = formData.get("category_id") as string;
     const tags = formData.getAll("tags") as string[];
     const status = formData.get("status") as string;
     const categoryId = Number(category_id);
     if(!categoryId) {
          throw data("Category ID is required", { status: 400 });
     }
     if(Number.isNaN(categoryId)) {
          throw data("Category ID must be a number", { status: 400 });
     }
     const post = await createPost({
          title,
          content,
          category_id: categoryId,
          status,
          tags: tags.map((tag) => Number(tag)),
     });
     return redirect(`/posts/${post.id}`)
}

export async function updatePostAction({ request, params }: { request: Request; params: { id?: string } }): Promise<Response> {
     if(!params.id){
          throw data("Post ID is required for update", { status: 400 });
     }
     const postId = Number(params.id);
     if(Number.isNaN(postId)){
          throw data("Post ID must be a number", { status: 400 });
     }

     const formData = await request.formData();
     const title = String(formData.get("title") || "");
     const content = String(formData.get("content") || "");
     const categoryId = Number(formData.get("category_id") || 0);
     if(!categoryId){
          throw data("Category ID is required", { status: 400 });
     }
     const status = String(formData.get("status") || "");
     const tags = formData.getAll("tags").map((tag) => Number(tag));

     const post = await updatePost(postId, {
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
                    throw data("Post ID is required", { status: 400 });
               }
               const createCommentPostId = Number(params.id);
               if(Number.isNaN(createCommentPostId)){
                    throw data("Post ID must be a number", { status: 400 });
               }
               await createComment(createCommentPostId, {
                    content,
               });
               return redirect(`/posts/${params.id}`);
          case "delete-comment":
               const commentId = String(formData.get("comment_id")|| "");
               if(!commentId){
                    throw data("Comment ID is required", { status: 400 });
               }
               const deleteCommentId = Number(commentId);
               if(Number.isNaN(deleteCommentId)){
                    throw data("Comment ID must be a number", { status: 400 });
               }
               await deleteComment(deleteCommentId);
               return redirect(`/posts/${params.id}`);
          case "update-comment":
               const editedCommentId = String(formData.get("comment_id")|| "");
               const editedContent = String(formData.get("content")|| "");
               if(!editedCommentId){
                    throw data("Comment ID is required", { status: 400 });
               }
               const updateCommentId = Number(editedCommentId);
               if(Number.isNaN(updateCommentId)){
                    throw data("Comment ID must be a number", { status: 400 });
               }
               await updateComment(updateCommentId, {
                    content: editedContent,
               });
               return redirect(`/posts/${params.id}`);
          case "delete-post":
               const postId = String(formData.get("post_id")|| "");
               if(!postId){
                    throw data("Post ID is required", { status: 400 });
               }
               const deletePostId = Number(postId);
               if(Number.isNaN(deletePostId)){
                    throw data("Post ID must be a number", { status: 400 });
               }
               await deletePost(deletePostId);
               return redirect(`/`);
          default:
               throw data("Unknown post action", { status: 400 });
     }
}
