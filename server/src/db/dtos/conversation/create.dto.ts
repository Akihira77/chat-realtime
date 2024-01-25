import { z } from "zod";

export const CreateConversationDTO = z
    .object({
        receiverId: z.string().max(36),
        message: z.string().max(1000)
    })
    .strict();

export type CreateConversationDtoType = z.infer<typeof CreateConversationDTO>;
