import { z } from "zod";
import { StatusCodes } from "../utils/constants.js";
import { formatErrors } from "../utils/validateZodSchema.js";

export class ValidationAPIError extends Error {
    readonly statusCode: number;
    constructor(readonly errors: z.ZodError<any> | Record<string, string[]>) {
        super();
        this.name = "Schema validation";
        this.statusCode = StatusCodes.BadRequest400;
    }
}

export class ZValidationAPIError extends Error {
    readonly statusCode: number;
    readonly errors: Record<string, string[]>;
    constructor(errors: z.ZodError<any>) {
        super();
        this.name = "Schema Validation";
        this.statusCode = StatusCodes.BadRequest400;
        this.errors = formatErrors(errors, {});
    }
}
