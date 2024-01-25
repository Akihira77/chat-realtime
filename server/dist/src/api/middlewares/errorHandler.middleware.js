import { StatusCodes } from "../../utils/constants.js";
import { CustomAPIError, ValidationAPIError, } from "../../errors/index.error.js";
import { HTTPException } from "hono/http-exception";
export const errorHandler = (err, context) => {
    console.log("Catching error from Error Middleware =", err);
    if (err instanceof ValidationAPIError) {
        context.status(err.statusCode);
        return context.json({ errors: err.errors });
    }
    else if (err instanceof CustomAPIError) {
        context.status(err.statusCode);
        return context.json({ errors: err.message });
    }
    else if (err instanceof HTTPException) {
        return err.getResponse();
    }
    context.status(StatusCodes.InternalServerError500);
    return context.json({ err });
};
//# sourceMappingURL=errorHandler.middleware.js.map