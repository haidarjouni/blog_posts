import { data, isRouteErrorResponse, redirect } from "react-router-dom";
import { createTag, deleteTag, updateTag } from "../../api/tags";

export async function createTagAction({ request }: { request: Request }) {
     const formData = await request.formData();
     switch(String(formData.get("intent") || "")){
          case "create-tag": {
               const name = String(formData.get("name") || "");

               try {
                    await createTag({ name });
               } catch (error) {
                    if (isRouteErrorResponse(error) && error.status === 400) {
                         const message = typeof error.data === "string" ? error.data : "Failed to create tag";
                         return data({ error: message, intent: "create-tag" }, { status: 400 });
                    }

                    throw error;
               }

               return redirect("/create-tag");
          }
          case "delete-tag": {
               const tagId = Number(formData.get("tagId") || 0);
               if (!tagId) {
                    throw data("Tag ID is required for deletion", { status: 400 });
               }
               await deleteTag(tagId);
               
               return redirect("/create-tag");
          }
          case "update-tag": {
               const updateTagId = Number(formData.get("tagId") || 0);
               if (!updateTagId) {
                    throw data("Tag ID is required for update", { status: 400 });
               }
               const updatedName = String(formData.get("name") || "");
               try {
                    await updateTag(updateTagId, { name: updatedName });
               } catch (error) {
                    if (isRouteErrorResponse(error) && error.status === 400) {
                         const message = typeof error.data === "string" ? error.data : "Failed to update tag";
                         return data(
                              { error: message, intent: "update-tag", tagId: updateTagId },
                              { status: 400 }
                         );
                    }

                   throw error;
               }
               return redirect("/create-tag");
          }
          default:
               throw data("Unknown tag action", { status: 400 });
     }
}
