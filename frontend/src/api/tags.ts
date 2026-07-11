import { throwApiError } from "./apiError";
import { apiFetch } from "./apiFetch";
import type {TagCreate, TagRead, TagUpdate} from "../types/tag";

// Read all tags for checkbox lists and admin tag screens.
export async function getTags(): Promise<TagRead[]> {
     const response = await apiFetch("/api/tags/");
     if (!response.ok) {
           await throwApiError(response, "Failed to fetch tags");
     }
     return response.json();
}

// Create one tag. The backend builds the slug from the submitted name.
export async function createTag(tag: TagCreate): Promise<TagRead> {
     const response = await apiFetch("/api/tags/", {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(tag),
     });

     if (!response.ok) {
          await throwApiError(response, "Failed to create tag");
     }

     return response.json();
}


export async function deleteTag(tagId: number): Promise<void> {
     const response = await apiFetch(`/api/tags/${tagId}`, {
          method: "DELETE",
     });

     if (!response.ok) {
          await throwApiError(response, "Failed to delete tag");
     }
}

export async function updateTag(tagId: number, tag: TagUpdate): Promise<TagRead> {
     const response = await apiFetch(`/api/tags/${tagId}`, {
          method: "PATCH",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(tag),
     });
     if (!response.ok) {
          await throwApiError(response, "Failed to update tag");
     }

     return response.json();
}
