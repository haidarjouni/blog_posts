import type {Posts} from "../types/post";

export async function getPosts(): Promise<Posts> {
     const response = await fetch("http://localhost:8000/api/posts/");

     if (!response.ok) {
         throw new Error("Failed to fetch posts");
     }
     const data = await response.json();
     console.log("POSTS API DATA:", data);
     return data;
}