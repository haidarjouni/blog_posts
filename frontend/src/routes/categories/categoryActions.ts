import { redirect } from "react-router-dom";
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
               if (categoryId) {
                    await deleteCategory(categoryId);
                    return redirect("/create-category");
               }
               break;
          case "update-category":
               // checks the case
               const updateCategoryId = Number(formData.get("categoryId") || null);
               const updatedName = String(formData.get("name") || "");
               const updatedDescription = String(formData.get("description") || "");
               // gets the info
               if (updateCategoryId) { // if exists sends teh patch update 
                    await updateCategory(updateCategoryId, {
                         name: updatedName,
                         description: updatedDescription || undefined, // undefined if empty
                    });
                    return redirect("/create-category");
               }
               break;
          default:
               throw new Error("Unknown intent");
          
     }
     return redirect("/create-category");
}
