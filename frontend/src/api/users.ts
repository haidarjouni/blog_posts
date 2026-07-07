import type { UserCreate } from '../types/user';

export async function signUp(user: UserCreate): Promise<void> {
      const response = await fetch("http://localhost:8000/api/users/", {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
     });

     if (!response.ok) {
          throw new Error("Failed to create user");
     }
}
