import { redirect } from "react-router-dom";
import {signUp} from "../../api/users";
export async function signupAction({request}: { request: Request }): Promise<Response> {
     const formData  = await request.formData();
     const username = String (formData.get("username") || "");
     const email = String( formData.get("email") || "");
     const password = String( formData.get("password") || "");
     await signUp({ username, email, password });
     return redirect("/login");
}
