import { data, isRouteErrorResponse, redirect } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { logout } from "../../api/auth";
export async function loginAction({ request }: { request: Request }) {
     const formData = await request.formData();
     const username = String(formData.get("username") || "");
     const password = String(formData.get("password") || "");
     try {
          await loginUser({ username, password });
     } catch (error) {
          if (isRouteErrorResponse(error) && (error.status === 400 || error.status === 401)) {
               const message = typeof error.data === "string" ? error.data : "Failed to login";
               return data({ error: message }, { status: error.status });
          }

          throw error;
     }
     return redirect("/");
}

export async function logoutAction() {
     await logout();
     return redirect("/");
}
