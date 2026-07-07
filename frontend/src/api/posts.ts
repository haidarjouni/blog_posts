import type {Posts, PostCreate, Post, PostDetail} from "../types/post";
import type {CommentCreate, CommentRead} from "../types/comment";
export async function getPosts(): Promise<Posts> {
     const response = await fetch("http://localhost:8000/api/posts/");

     if (!response.ok) {
         throw new Error("Failed to fetch posts");
     }
     const data = await response.json();
     return data;
}

export async function createPost(postData: PostCreate): Promise<Post> {
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