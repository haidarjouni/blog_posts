import { data, isRouteErrorResponse, redirect } from "react-router-dom";
import { createCategory, deleteCategory, updateCategory } from "../../api/categories";

export async function createCategoryAction({ request }: { request: Request }) {
     const formData = await request.formData();
     switch(String(formData.get("intent") || "")){
          case "create-category": {
               const name = String(formData.get("name") || "");
               const description = String(formData.get("description") || "");
               try {
                    await createCategory({
                         name,
                         description: description || undefined,
                    });
               } catch (error) {
                    if (isRouteErrorResponse(error) && error.status === 400) {
                         return data(
                              {
                                   error: typeof error.data === "string" ? error.data : "Failed to create category",
                                   intent: "create-category",
                              },
                              { status: 400 }
                         );
                    }
                    throw error;
               }
               return redirect("/create-category");
          }
          case "delete-category": {
               const categoryId = Number(formData.get("categoryId") || null);
               if (!categoryId) {
                    throw data("Category ID is required for deletion", { status: 400 });
               }
               await deleteCategory(categoryId);
               return redirect("/create-category");
          }
          case "update-category": {
               const updateCategoryId = Number(formData.get("categoryId") || null);
               if(!updateCategoryId) {
                    throw data("Category ID is required for update", { status: 400 });
               }
               const updatedName = String(formData.get("name") || "");
               const updatedDescription = String(formData.get("description") || "");
               try {
                    await updateCategory(updateCategoryId, {
                         name: updatedName,
                         description: updatedDescription || undefined,
                    });
               } catch (error) {
                    if (isRouteErrorResponse(error) && error.status === 400) {
                         return data(
                              {
                                   error: typeof error.data === "string" ? error.data : "Failed to update category",
                                   intent: "update-category",
                                   categoryId: updateCategoryId,
                              },
                              { status: 400 }
                         );
                    }
                    throw error;
               }
               return redirect("/create-category");
          }
          default:
               throw data("Unknown category action", { status: 400 });
          
     }
}
