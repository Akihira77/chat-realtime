import { z } from "zod";
import { Buffer } from "buffer";

export const ConversationParamsDTO = z
    .object({
        receiverId: z.string().max(36)
    })
    .strict();

export type ConversationParamsDtoType = z.infer<typeof ConversationParamsDTO>;

export const SenderAndReceiverBody = z
    .object({
        senderId: z.string().min(1).max(36),
        receiverId: z.string().min(1).max(36)
    })
    .strict();

export type SenderAndReceiverBodyType = z.infer<typeof SenderAndReceiverBody>;

export const ChatRequestDTO = z
    .object({
        senderId: z.string().min(1).max(36),
        receiverId: z.string().min(1).max(36),
        content: z.optional(z.string()),
        files: z.optional(
            z
                .any()
                .superRefine((file: unknown, ctx: z.RefinementCtx) => {
                    if (!(file instanceof Buffer)) {
                        return ctx.addIssue({
                            code: "custom",
                            message: "File is incorrect"
                        });
                    }
                })
                .transform((val) => val as Buffer)
        )
    })
    .strict();

export type ChatRequestDtoType = z.infer<typeof ChatRequestDTO>;
