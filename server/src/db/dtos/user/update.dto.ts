import { z } from "zod";

export const UpdateUserDTO = z.object({
    fullName: z.string().max(25),
    phoneNumber: z.string().max(16)
}).strict();

export type UpdateUserDtoType = z.infer<typeof UpdateUserDTO>;