import { data } from "react-router-dom";
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
          throw data("User ID is required", { status: 400 });
     }
     const userId = Number(params.id);
     if(Number.isNaN(userId)) {
          throw data("User ID must be a number", { status: 400 });
     }
     const user = await getUserById(userId);
     return { user };
}

export async function userLoader({ params }: { params: { id?: string } }): Promise<UserLoaderData> {
     if (!params.id) {
          throw data("User ID is required", { status: 400 });
     }
     const userId = Number(params.id);
     if(Number.isNaN(userId)) {
          throw data("User ID must be a number", { status: 400 });
     }
     const currentUser = await requireUser();
     if(currentUser.id !== userId && !currentUser.is_admin) {
          throw data("You are not authorized to edit this user", { status: 403 });
     }
     const user = await getUserById(userId);
     return { user };
}
