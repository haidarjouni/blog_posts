import { data, isRouteErrorResponse, redirect } from "react-router-dom";
import {signUp} from "../../api/users";
export async function signupAction({request}: { request: Request }) {
     const formData  = await request.formData();
     const username = String (formData.get("username") || "");
     const email = String( formData.get("email") || "");
     const password = String( formData.get("password") || "");
     try {
          await signUp({ username, email, password });
     } catch (error) {
          if (isRouteErrorResponse(error) && error.status === 400) {
               const message = typeof error.data === "string" ? error.data : "Failed to create user";
               return data({ error: message }, { status: 400 });
          }

          throw error;
     }
     return redirect("/login");
}
