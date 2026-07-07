import { getTags } from "../../api/tags";
import type { TagRead } from "../../types/tag";

// Data shape that CreateTagPage receives from this loader.
export type CreateTagLoaderData = {
     tags: TagRead[];
}

// Load existing tags before the create-tag page renders.
export async function createTagLoader(): Promise<CreateTagLoaderData> {
     const tags = await getTags();
     return { tags };
}
