import { redirect } from 'react-router-dom';
import {deleteUser, updateUser} from '../../api/users';
import type { UserUpdate } from '../../types/user';
export async function userAction({ request, params }: { request: Request, params: { id?: string } }): Promise<Response> {
     const formData = await request.formData();
     const intent = String(formData.get("intent") || "");
     switch (intent) {
          case "update-user":
               let userId = Number(params.id || null);
               if (!userId) {
                    throw new Error("User ID is required for update");
               }
               const username = String(formData.get("username") || "");
               const email = String(formData.get("email") || "");
               await updateUserAction({ username, email }, userId);
               return redirect(`/users/${userId}`);
          case "delete-user":
               const deleteUserId = Number(formData.get("userId") || null);
               if (!deleteUserId) {
                    throw new Error("User ID is required for deletion");
               }
               await deleteUserAction(deleteUserId);
               return redirect("/");
          default:
               throw new Error("Unknown intent");
     }
}


export async function updateUserAction( user: UserUpdate, userId: number): Promise<void> {
      if (!userId) {
          throw new Error("User ID is required");
     }
     const updatedUser =  await updateUser(userId, {
          username: user.username,
          email: user.email,
     });

     if (!updatedUser) {
          throw new Error("Failed to update user");
     }
     
}

export async function deleteUserAction(userId: number): Promise<void> {
     if (!userId) {
          throw new Error("User ID is required");
     }
     await deleteUser(userId);
}
