import { redirect } from "react-router-dom";
import { createTag, deleteTag, updateTag } from "../../api/tags";

export async function createTagAction({ request }: { request: Request }) {
     const formData = await request.formData();
     switch(String(formData.get("intent") || "")){
          case "create-tag":
               const name = String(formData.get("name") || "");

               await createTag({ name });

               return redirect("/create-tag");
          case "delete-tag":
               const tagId = Number(formData.get("tagId") || 0);
               
               await deleteTag(tagId);
               
               return redirect("/create-tag");
          case "update-tag": 
               // checks the case
               const updateTagId = Number(formData.get("tagId") || 0);
               const updatedName = String(formData.get("name") || "");
               //gets the info 
               await updateTag(updateTagId, { name: updatedName });
               // updates the tag
               return redirect("/create-tag");
          default:
               throw new Error("Unknown intent");
     }
}
