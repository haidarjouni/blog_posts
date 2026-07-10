import { getUserById } from "../../api/users";
import { requireUser } from "../../auth/guards";
import type { UserDetail } from "../../types/user";
type UserLoaderWithPostsData = {
     user: UserDetail;
};
export type UserLoaderData = {
     user: UserDetail;
};
export async function userLoaderWithPosts({ params }: { params: { id?: string } }): Promise<UserLoaderWithPostsData> {
     if (!params.id) {
          throw new Error("User ID is required");
     }
     const user = await getUserById(Number(params.id));
     if(!user) {
          throw new Error("User not found");
     }
     return { user };
}

export async function userLoader({ params }: { params: { id?: string } }): Promise<UserLoaderData> {
     if (!params.id) {
          throw new Error("User ID is required");
     }
     const currentUser = await requireUser();
     const user = await getUserById(Number(params.id));
     if(!user) {
          throw new Error("User not found");
     }
     if(currentUser.id !== user.id && !currentUser.is_admin) {
          throw new Error("You are not authorized to edit this user");
     }
     return { user };
}
