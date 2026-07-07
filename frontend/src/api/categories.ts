import type {CategoryCreate, CategoryRead} from "../types/category";

// Read all categories for dropdowns and admin category screens.
export async function getCategories(): Promise<CategoryRead[]> {
     const response = await fetch("http://localhost:8000/api/categories/");
     if (!response.ok) {
           throw new Error("Failed to fetch categories");
     }
     return response.json();
}

// Create one category. The backend builds the slug from the submitted name.
export async function createCategory(category: CategoryCreate): Promise<CategoryRead> {
     const response = await fetch("http://localhost:8000/api/categories/", {
          method: "POST",
          credentials: "include",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
     });

     if (!response.ok) {
          console.log("Failed to create category");
     }

     return response.json();
}
