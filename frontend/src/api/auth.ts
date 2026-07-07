import type { UserRead } from "../types/user";

export async function getCurrentUser() : Promise<UserRead | null> {
     let response = await fetch("http://localhost:8000/api/users/me", {
          method: "GET",
          credentials: "include",
     });

     if(response.status === 401) {
          const refresh = await refreshSession();
          
          if(!refresh) {
               return null;
          }

          response = await fetch("http://localhost:8000/api/users/me", {
               method: "GET",
               credentials: "include",
          });

     }
     if (response.status === 401) {
          return null;
     }

     if (response.status === 204) {
          return null;
     }

     if (!response.ok) {
          throw new Error("Failed to fetch current user");
     }
     return await response.json();
}

export async function refreshSession(): Promise<boolean>{
     const response = await fetch("http://localhost:8000/api/auth/refresh", {
          method: "POST",
          credentials: "include",
     });
     return response.ok;
}

export async function logout(): Promise<void> {
     const response = await fetch("http://localhost:8000/api/auth/logout", {
          method: "POST",
          credentials: "include",
     });
     if (!response.ok) {
          throw new Error("Failed to logout");
     }
     return;
}