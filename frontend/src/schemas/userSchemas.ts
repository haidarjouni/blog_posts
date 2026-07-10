import * as z from "zod";

export const userCreateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be at most 50 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be at most 128 characters long").regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: "Must contain both letters and numbers",
  }).refine((value) => !/\s/.test(value), {
     message: "Password must not contain spaces",})
});

export const userUpdateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be at most 50 characters long"),
  email: z.email("Invalid email address"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
