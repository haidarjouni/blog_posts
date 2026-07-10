import { data, redirect } from 'react-router-dom';
import {deleteUser, updateUser} from '../../api/users';
import type { UserUpdate } from '../../types/user';
export async function userAction({ request, params }: { request: Request, params: { id?: string } }): Promise<Response> {
     const formData = await request.formData();
     const intent = String(formData.get("intent") || "");
     switch (intent) {
          case "update-user":
               let userId = Number(params.id || null);
               if (!userId) {
                    throw data("User ID is required for update", { status: 400 });
               }
               const username = String(formData.get("username") || "");
               const email = String(formData.get("email") || "");
               await updateUserAction({ username, email }, userId);
               return redirect(`/users/${userId}`);
          case "delete-user":
               const deleteUserId = Number(formData.get("userId") || null);
               if (!deleteUserId) {
                    throw data("User ID is required for deletion", { status: 400 });
               }
               await deleteUserAction(deleteUserId);
               return redirect("/");
          default:
               throw data("Unknown user action", { status: 400 });
     }
}


export async function updateUserAction( user: UserUpdate, userId: number): Promise<void> {
      if (!userId) {
          throw data("User ID is required", { status: 400 });
     }
     const updatedUser =  await updateUser(userId, {
          username: user.username,
          email: user.email,
     });

     if (!updatedUser) {
          throw data("Failed to update user", { status: 500 });
     }
     
}

export async function deleteUserAction(userId: number): Promise<void> {
     if (!userId) {
          throw data("User ID is required", { status: 400 });
     }
     await deleteUser(userId);
}
