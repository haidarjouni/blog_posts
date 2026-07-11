import * as z from "zod";

export const commentCreateSchema = z.object({
     content: z.string().trim().min(1, "Comment content is required").max(500, "Comment content must be at most 500 characters long"),
});

export const commentUpdateSchema = commentCreateSchema.partial();

export type CreateCommentInput = z.infer<typeof commentCreateSchema>;
export type UpdateCommentInput = z.infer<typeof commentUpdateSchema>;