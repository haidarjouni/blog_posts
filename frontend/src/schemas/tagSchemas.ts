import * as z from "zod";

export const tagCreateSchema = z.object({
     name: z.string().trim().min(2, "Tag name must be at least 2 characters long").max(100, "Tag name must be at most 100 characters long"),
});

export const tagUpdateSchema = tagCreateSchema.partial();

export type CreateTagInput = z.infer<typeof tagCreateSchema>;
export type UpdateTagInput = z.infer<typeof tagUpdateSchema>;