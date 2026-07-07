import type {Posts, PostCreate, Post, PostDetail} from "../types/post";

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