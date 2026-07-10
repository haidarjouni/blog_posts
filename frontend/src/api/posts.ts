import type {PostCreate, PostRead, PostDetail, PostUpdate} from "../types/post";
import type {CommentCreate, CommentRead, CommentUpdate} from "../types/comment";
export async function getPosts(): Promise<PostRead[]> {
     const response = await fetch("http://localhost:8000/api/posts/");

     if (!response.ok) {
         throw new Error("Failed to fetch posts");
     }
     const data = await response.json();
     return data;
}

export async function createPost(postData: PostCreate): Promise<PostRead> {
     const response = await fetch("http://localhost:8000/api/posts/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
     });

     if (!response.ok) {
         throw new Error("Failed to create post");
     }
     const data = await response.json();
     return data;
}

export async function getPostById(postId: number): Promise<PostDetail> {
        const response = await fetch(`http://localhost:8000/api/posts/${postId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        return data;
}

export async function deletePost(postId: number): Promise<void> {
    const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error("Failed to delete post");
    }
}

export async function updatePost(postId: number, postData: PostUpdate): Promise<PostRead> {
    const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        throw new Error("Failed to update post");
    }

    return response.json();
}

export async function createComment(postID: number, commentData: CommentCreate): Promise<CommentRead> {
    const response = await fetch(`http://localhost:8000/api/posts/${postID}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
    });

    if (!response.ok) {
        throw new Error("Failed to create comment");
    }

    const data = await response.json();
    return data;
}

export async function deleteComment(commentID: number): Promise<void> {
    const response = await fetch(`http://localhost:8000/api/posts/comments/${commentID}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error("Failed to delete comment");
    }
}

export async function updateComment(commentID: number, commentData: CommentUpdate): Promise<CommentRead> {
    const response = await fetch(`http://localhost:8000/api/posts/comments/${commentID}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData)
    });

    if (!response.ok) {
        throw new Error("Failed to update comment");
    }

    return response.json();
}
