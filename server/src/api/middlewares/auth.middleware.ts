import { CustomAPIError } from "../../errors/index.error.js";
import { StatusCodes } from "../../utils/constants.js";
import { jwtVerify } from "../../utils/jwt.js";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

const authentication = async (context: Context, next: Next) => {
    try {
        // COOKIE APPROACH
        const token = getCookie(context, "token");
        if (!token || token === "") {
            throw new CustomAPIError(
                "Unauthenticated",
                StatusCodes.Forbidden403
            );
        }

        const payload = jwtVerify(token);
        // console.log(payload);
        context.set("user", payload);
        await next();
    } catch (error) {
        throw error;
    }
};

export default authentication;
