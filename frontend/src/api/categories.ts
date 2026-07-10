import type {CategoryCreate, CategoryRead, CategoryUpdate} from "../types/category";

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
          throw new Error("Failed to create category");
     }

     return response.json();
}

export async function deleteCategory(categoryId: number): Promise<void> {
     const response = await fetch(`http://localhost:8000/api/categories/${categoryId}`, {
          method: "DELETE",
          credentials: "include",
     });

     if (!response.ok) {
          throw new Error("Failed to delete category");
     }
}

export async function updateCategory(categoryId: number, category: CategoryUpdate): Promise<CategoryRead> {
     // send a patch request to the backend to update the category with the given ID
     const response = await fetch(`http://localhost:8000/api/categories/${categoryId}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
     });

     if (!response.ok) {
          throw new Error("Failed to update category");
     }

     return response.json();
}