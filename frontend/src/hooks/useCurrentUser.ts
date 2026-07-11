import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth";
import type { UserRead } from "../types/user";

export function useCurrentUser() {
     return useQuery<UserRead | null>({
          queryKey: ["currentUser"],
          queryFn: getCurrentUser,
     });
}
