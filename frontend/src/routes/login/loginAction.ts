import { redirect } from "react-router-dom";
import { loginUser } from "../../api/login";
import { logout } from "../../api/auth";
export async function loginAction({ request }: { request: Request }) {
     const formData = await request.formData();
     const username = String(formData.get("username") || "");
     const password = String(formData.get("password") || "");
     await loginUser({ username, password });
     return redirect("/");
}

export async function logoutAction() {
     await logout();
     return redirect("/");
}