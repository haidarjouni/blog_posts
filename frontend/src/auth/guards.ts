import { redirect } from "react-router-dom";
import { getCurrentUser } from "../api/auth";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw redirect("/login");
  }

  return user;
}

