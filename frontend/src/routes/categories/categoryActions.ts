import { data, redirect } from "react-router-dom";
import { createCategory, deleteCategory, updateCategory } from "../../api/categories";

export async function createCategoryAction({ request }: { request: Request }) {
     const formData = await request.formData();
     switch(String(formData.get("intent") || "")){
          case "create-category":
               const name = String(formData.get("name") || "");
               const description = String(formData.get("description") || "");
               await createCategory({
                    name,
                    description: description || undefined,
               });
               break;
          case "delete-category":
               const categoryId = Number(formData.get("categoryId") || null);
               if (!categoryId) {
                    throw data("Category ID is required for deletion", { status: 400 });
               }
               await deleteCategory(categoryId);
               return redirect("/create-category");
          case "update-category":
               const updateCategoryId = Number(formData.get("categoryId") || null);
               if(!updateCategoryId) {
                    throw data("Category ID is required for update", { status: 400 });
               }
               const updatedName = String(formData.get("name") || "");
               const updatedDescription = String(formData.get("description") || "");
               await updateCategory(updateCategoryId, {
                    name: updatedName,
                    description: updatedDescription || undefined,
               });
               return redirect("/create-category");
          default:
               throw data("Unknown category action", { status: 400 });
          
     }
     return redirect("/create-category");
}
