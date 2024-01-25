import { z } from "zod";

type ErrorObject = Record<string, string[]>;
type ValidationResult = {
    success: boolean;
    errors: ErrorObject;
};

export function validateZodSchema(
    schema: z.Schema,
    data: unknown
): ValidationResult {
    const validationResult = schema.safeParse(data);
    let errors: ErrorObject = {};

    if (!validationResult.success) {
        for (const { path, message } of validationResult.error.issues) {
            const key = String(path[0]);
            if (key in errors) {
                errors[key]!.push(message);
            } else {
                errors[key] = [message];
            }
        }
    }

    return { success: validationResult.success, errors };
}

export function formatErrors(
    errorValidations: z.ZodError,
    errors: ErrorObject
) {
    for (const { path, message } of errorValidations.issues) {
        const key = String(path[0]);
        if (key in errors) {
            errors[key]!.push(message);
        } else {
            errors[key] = [message];
        }
    }

    return errors;
}
