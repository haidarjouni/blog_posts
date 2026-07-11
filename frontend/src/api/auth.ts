import type { UserRead } from "../types/user";
import { apiFetch } from "./apiFetch";
import { throwApiError } from "./apiError";

type LoginRequest = {
     username: string;
     password: string;
}

export async function loginUser(request: LoginRequest): Promise<void> {
     const body = new URLSearchParams();
     body.set("username", request.username);
     body.set("password", request.password);

     const response = await apiFetch("/api/auth/login", {
          method: "POST",
          headers: {
               "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
     }, false);

     if (!response.ok) {
          await throwApiError(response, "Failed to login");
     }
}

export async function getCurrentUser() : Promise<UserRead | null> {
     const response = await apiFetch("/api/users/me", {
          method: "GET",
     });

     if (response.status === 401) {
          return null;
     }

     if (response.status === 204) {
          return null;
     }

     if (!response.ok) {
          await throwApiError(response, "Failed to fetch current user");
     }
     return await response.json();
}


export async function refreshSession(): Promise<boolean>{
     const response = await apiFetch("/api/auth/refresh", {
          method: "POST",
     }, false);
     return response.ok;
}

export async function logout(): Promise<void> {
     const response = await apiFetch("/api/auth/logout", {
          method: "POST",
     });
     if (!response.ok) {
          await throwApiError(response, "Failed to logout");
     }
     return;
}
