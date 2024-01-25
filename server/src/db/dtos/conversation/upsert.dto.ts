import { z } from "zod";

export const UpsertConversationDTO = z
    .object({
        senderId: z.string().max(36),
        receiverId: z.string().max(36),
        message: z.string().max(1000)
    })
    .strict();

export type UpsertConversationDtoType = z.infer<typeof UpsertConversationDTO>;
