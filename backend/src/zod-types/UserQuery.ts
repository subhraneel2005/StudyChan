import z from "zod";

export const UserQuerySchema = z.object({
    userQuery: z.string().min(1),
    documentId: z.string().min(4)
});