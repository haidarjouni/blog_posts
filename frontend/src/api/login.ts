type LoginRequest = {
     username: string;
     password: string;
}

export async function loginUser(request: LoginRequest): Promise<void> {
     const body = new URLSearchParams();
     body.set("username", request.username);
     body.set("password", request.password);
     const response = await fetch("http://localhost:8000/api/auth/login/", {
          method: "POST",
          credentials: "include",
          headers: {
               "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
     });
     if (!response.ok) {
          throw new Error("Failed to login");
     }
}