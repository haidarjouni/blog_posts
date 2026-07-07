import { redirect } from "react-router-dom";
import { createCategory } from "../../api/categories";

// React Router calls this action when the category form submits.
export async function createCategoryAction({ request }: { request: Request }) {
     // Pull browser form values out of the submitted Request.
     const formData = await request.formData();
     const name = String(formData.get("name") || "");
     const description = String(formData.get("description") || "");

     // Send a JSON body that matches the FastAPI CategoryCreate schema.
     await createCategory({
          name,
          description: description || undefined,
     });

     // Return to the same page so the loader refetches and shows the new category.
     return redirect("/create-category");
}