import * as z from "zod";

export const categoryCreateSchema = z.object({
     name: z.string().trim().min(2, "Category name must be at least 2 characters long").max(100, "Category name must be at most 100 characters long"),
     description: z.string().trim().max(500, "Description must be at most 500 characters long").optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CreateCategoryInput = z.infer<typeof categoryCreateSchema>;
export type UpdateCategoryInput = z.infer<typeof categoryUpdateSchema>;