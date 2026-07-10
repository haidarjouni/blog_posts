import { data, redirect } from "react-router-dom";
import { getCurrentUser } from "../api/auth";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!user.is_admin) {
    throw data("You do not have permission to access this page", { status: 403 });
  }

  return user;
}
