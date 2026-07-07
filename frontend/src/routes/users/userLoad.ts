import { getUserById } from "../../api/users";
import type { UserDetail } from "../../types/user";
type UserLoaderData = {
     user: UserDetail;
};
export async function userLoader({ params }: { params: { id?: string } }): Promise<UserLoaderData> {
     if (!params.id) {
          throw new Error("User ID is required");
     }
     const user = await getUserById(Number(params.id));
     if(!user) {
          throw new Error("User not found");
     }
     return { user };
}
