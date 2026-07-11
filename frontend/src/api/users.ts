import { throwApiError } from './apiError';
import { apiFetch } from './apiFetch';
import type { UserCreate, UserDetail, UserUpdate, UserRead  } from '../types/user';

export async function signUp(user: UserCreate): Promise<void> {
      const response = await apiFetch("/api/users/", {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
     });

     if (!response.ok) {
          await throwApiError(response, "Failed to create user");
     }
}

export async function getUserById(userId: number): Promise<UserDetail> {
     const response = await apiFetch(`/api/users/${userId}`, {
          method: "GET",
     });
     if(!response.ok) {
          await throwApiError(response, "Failed to fetch user");
     }
     return await response.json();
}

export async function getUserAccountById(userId: number): Promise<UserRead> {
     const response = await apiFetch(`/api/users/${userId}/account`, {
          method: "GET",
     });
     if(!response.ok) {
          await throwApiError(response, "Failed to fetch account");
     }
     return await response.json();
}

export async function updateUser(userId: number, user: UserUpdate): Promise<UserRead> {
     const response = await apiFetch(`/api/users/${userId}`, {
          method: "PATCH",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
     });

     if (!response.ok) {
          await throwApiError(response, "Failed to update user");
     }
     
     return await response.json();
}

export async function deleteUser(userId: number): Promise<void> {
     const response = await apiFetch(`/api/users/${userId}`, {
          method: "DELETE",
     });
     if (!response.ok) {
          await throwApiError(response, "Failed to delete user");
     }
}
