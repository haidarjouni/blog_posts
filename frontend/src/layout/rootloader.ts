import type {UserRead} from "../types/user";
import { getCurrentUser } from "../api/auth";

export async function rootLoader(): Promise<{ user: UserRead | null }> {
     const user = await getCurrentUser();
     return { user };
}