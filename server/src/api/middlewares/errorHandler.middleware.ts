import { StatusCodes } from "../../utils/constants.js";
import {
    CustomAPIError,
    ValidationAPIError,
    ZValidationAPIError
} from "../../errors/index.error.js";
import { Context, ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler: ErrorHandler = (err: unknown, context: Context) => {
    console.log("Catching error from Error Middleware =", err);

    if (err instanceof ValidationAPIError) {
        context.status(err.statusCode);
        return context.json({ errors: err.errors });
    } else if (err instanceof CustomAPIError) {
        context.status(err.statusCode);
        return context.json({ errors: err.message });
    } else if (err instanceof HTTPException) {
        return err.getResponse();
    } else if (err instanceof ZValidationAPIError) {
        context.status(err.statusCode);
        return context.json({ errors: err.errors });
    }

    context.status(StatusCodes.InternalServerError500);
    return context.json({ err });
};
