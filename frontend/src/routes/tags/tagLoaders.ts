import { getTags } from "../../api/tags";
import { requireAdmin } from "../../auth/guards";
import type { TagRead } from "../../types/tag";

// Data shape that CreateTagPage receives from this loader.
export type CreateTagLoaderData = {
     tags: TagRead[];
}

// Load existing tags before the create-tag page renders.
export async function createTagLoader(): Promise<CreateTagLoaderData> {
     await requireAdmin();
     const tags = await getTags();
     return { tags };
}
