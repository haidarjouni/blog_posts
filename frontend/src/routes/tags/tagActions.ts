import { redirect } from "react-router-dom";
import { createTag } from "../../api/tags";

// React Router calls this action when the tag form submits.
export async function createTagAction({ request }: { request: Request }) {
     // Pull the tag name out of the submitted form.
     const formData = await request.formData();
     const name = String(formData.get("name") || "");

     // Send a JSON body that matches the FastAPI TagCreate schema.
     await createTag({ name });

     // Return to the same page so the loader refetches and shows the new tag.
     return redirect("/create-tag");
}
