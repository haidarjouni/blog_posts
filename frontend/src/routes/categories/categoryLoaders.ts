import { getCategories } from "../../api/categories";
import type { CategoryRead } from "../../types/category";
// Data shape that CreateCategoryPage receives from this loader.
export type CreateCategoryLoaderData = {
     categories: CategoryRead[];
}

// Load existing categories before the create-category page renders.
export async function createCategoryLoader(): Promise<CreateCategoryLoaderData> {
     const categories = await getCategories();
     return { categories };
}
