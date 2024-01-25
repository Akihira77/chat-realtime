import { z } from "zod";

export const LoginRequestDTO = z
    .object({
        phoneNumber: z.string().max(16)
    })
    .strict();

export type LoginRequestDtoType = z.infer<typeof LoginRequestDTO>;
