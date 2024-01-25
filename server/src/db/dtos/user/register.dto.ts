import { z } from "zod";

export const RegisterRequestDTO = z
    .object({
        fullName: z.string().max(25),
        phoneNumber: z.string().max(16)
    })
    .strict();

export type RegisterRequestDtoType = z.infer<typeof RegisterRequestDTO>;
