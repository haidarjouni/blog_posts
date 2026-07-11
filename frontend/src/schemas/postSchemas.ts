import * as z from "zod";

export const postCreateSchema = z.object({
     title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters long"),
     category_id: z.coerce.number().int().positive("Category is required"),
     content: z.string().min(1, "Content is required"),
     status: z.enum(["draft", "published", "archived"]).default("draft"),
     tags: z.array(z.coerce.number().int().positive("Tag ID must be a positive integer")).min(1, "Select at least one tag").default([]),
});

export const postUpdateSchema = postCreateSchema.partial();
export type CreatePostFormInput = z.input<typeof postCreateSchema>;
export type CreatePostInput = z.infer<typeof postCreateSchema>;
export type UpdatePostInput = z.infer<typeof postUpdateSchema>;
