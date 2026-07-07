import type {TagCreate, TagRead} from "../types/tag";

// Read all tags for checkbox lists and admin tag screens.
export async function getTags(): Promise<TagRead[]> {
     const response = await fetch("http://localhost:8000/api/tags/");
     if (!response.ok) {
           throw new Error("Failed to fetch tags");
     }
     return response.json();
}

// Create one tag. The backend builds the slug from the submitted name.
export async function createTag(tag: TagCreate): Promise<TagRead> {
     const response = await fetch("http://localhost:8000/api/tags/", {
          method: "POST",
          credentials: "include",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(tag),
     });

     if (!response.ok) {
          throw new Error("Failed to create tag");
     }

     return response.json();
}
