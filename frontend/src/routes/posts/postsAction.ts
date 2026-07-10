import { data, isRouteErrorResponse, redirect } from "react-router-dom";
import { createComment, createPost, deleteComment, deletePost, updateComment, updatePost } from "../../api/posts";
export async function createPostsAction({ request }: { request: Request }) {
     const formData = await request.formData();
     const title = formData.get("title") as string;
     const content = formData.get("content") as string;
     const category_id = formData.get("category_id") as string;
     const tags = formData.getAll("tags") as string[];
     const status = formData.get("status") as string;
     let post;
     try {
          post = await createPost({
               title,
               content,
               category_id: Number(category_id),
               status,
               tags: tags.map((tag) => Number(tag)),
          });
     } catch (error) {
          if (isRouteErrorResponse(error) && error.status === 400) {
               const message = typeof error.data === "string" ? error.data : "Failed to create post";
               return data({ error: message }, { status: 400 });
          }

          throw error;
     }
     return redirect(`/posts/${post.id}`)
}

export async function updatePostAction({ request, params }: { request: Request; params: { id?: string } }) {
     if(!params.id){
          throw data("Post ID is required for update", { status: 400 });
     }

     const formData = await request.formData();
     const title = String(formData.get("title") || "");
     const content = String(formData.get("content") || "");
     const categoryId = Number(formData.get("category_id") || 0);
     const status = String(formData.get("status") || "");
     const tags = formData.getAll("tags").map((tag) => Number(tag));

     let post;
     try {
          post = await updatePost(Number(params.id), {
               title,
               content,
               category_id: categoryId,
               status,
               tags,
          });
     } catch (error) {
          if (isRouteErrorResponse(error) && error.status === 400) {
               const message = typeof error.data === "string" ? error.data : "Failed to update post";
               return data({ error: message }, { status: 400 });
          }

          throw error;
     }

     return redirect(`/posts/${post.id}`);
}

export async function createCommentAction({request,params}: {request: Request; params: { id?: string };}) {
     const formData = await request.formData();
     switch(String(formData.get("intent") || "")){
          case "create-comment":
               const content = String(formData.get("content")|| "");
               if(!params.id){
                    throw data("Post ID is required for comment creation", { status: 400 });
               }
               try {
                    await createComment(Number(params.id), {
                         content,
                    });
               } catch (error) {
                    if (isRouteErrorResponse(error) && error.status === 400) {
                         return data(
                              {
                                   error: typeof error.data === "string" ? error.data : "Failed to create comment",
                                   intent: "create-comment",
                              },
                              { status: 400 }
                         );
                    }

                    throw error;
               }
               return redirect(`/posts/${params.id}`);
          case "delete-comment":
               const commentId = String(formData.get("comment_id")|| "");
               if(!commentId){
                    throw data("Comment ID is required for deletion", { status: 400 });
               }
               await deleteComment(Number(commentId));
               return redirect(`/posts/${params.id}`);
          case "update-comment":
               const editedCommentId = String(formData.get("comment_id")|| "");
               const editedContent = String(formData.get("content")|| "");
               if(!editedCommentId){
                    throw data("Comment ID is required for update", { status: 400 });
               }
               try {
                    await updateComment(Number(editedCommentId), {
                         content: editedContent,
                    });
               } catch (error) {
                    if (isRouteErrorResponse(error) && error.status === 400) {
                         return data(
                              {
                                   error: typeof error.data === "string" ? error.data : "Failed to update comment",
                                   intent: "update-comment",
                                   commentId: Number(editedCommentId),
                              },
                              { status: 400 }
                         );
                    }

                    throw error;
               }
               return redirect(`/posts/${params.id}`);
          case "delete-post":
               const postId = String(formData.get("post_id")|| "");
               if(!postId){
                    throw data("Post ID is required for deletion", { status: 400 });
               }
               await deletePost(Number(postId));
               return redirect(`/`);
          default:
               throw data("Unknown post action", { status: 400 });
     }
}
