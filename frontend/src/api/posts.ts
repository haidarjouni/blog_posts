import { throwApiError } from "./apiError";
import { apiFetch } from "./apiFetch";
import type {PostCreate, PostRead, PostDetail, PostUpdate} from "../types/post";
import type {CommentCreate, CommentRead, CommentUpdate} from "../types/comment";

export async function getPosts(): Promise<PostRead[]> {
        const response = await apiFetch("/api/posts/");
        
        if (!response.ok) {
            await throwApiError(response, "Failed to fetch posts");
        }
        const data = await response.json();
        return data;
}

export async function createPost(postData: PostCreate): Promise<PostRead> {
     const response = await apiFetch("/api/posts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
     });
     if (!response.ok) {
         await throwApiError(response, "Failed to create post");
     }

     const data = await response.json();
     return data;
}

export async function getPostById(postId: number): Promise<PostDetail> {
        const response = await apiFetch(`/api/posts/${postId}`);
        if (!response.ok) {
            await throwApiError(response, "Failed to fetch post");
        }
        const data = await response.json();
        return data;
}

export async function getManagePostById(postId: number): Promise<PostDetail> {
        const response = await apiFetch(`/api/posts/${postId}/manage`);
        if (!response.ok) {
            await throwApiError(response, "Failed to fetch post");
        }
        const data = await response.json();
        return data;
}

export async function deletePost(postId: number): Promise<void> {
    const response = await apiFetch(`/api/posts/${postId}`, {
        method: "DELETE",
    });
    
    if (!response.ok) {
        await throwApiError(response, "Failed to delete post");
    }
}

export async function updatePost(postId: number, postData: PostUpdate): Promise<PostRead> {
    const response = await apiFetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to update post");
    }

    return response.json();
}

export async function createComment(postID: number, commentData: CommentCreate): Promise<CommentRead> {
    const response = await apiFetch(`/api/posts/${postID}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to create comment");
    }

    const data = await response.json();
    return data;
}

export async function deleteComment(commentID: number): Promise<void> {
    const response = await apiFetch(`/api/posts/comments/${commentID}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        await throwApiError(response, "Failed to delete comment");
    }
}

export async function updateComment(commentID: number, commentData: CommentUpdate): Promise<CommentRead> {
    const response = await apiFetch(`/api/posts/comments/${commentID}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to update comment");
    }

    return response.json();
}
