import { CustomAPIError } from "../../errors/index.error.js";
import { StatusCodes } from "../../utils/constants.js";
import { jwtVerify } from "../../utils/jwt.js";
import { getCookie, } from 'hono/cookie';
const authentication = async (context, next) => {
    try {
        const token = getCookie(context, "token");
        if (!token || token === "") {
            throw new CustomAPIError("Unauthenticated", StatusCodes.Forbidden403);
        }
        const payload = jwtVerify(token);
        context.set("user", payload);
        await next();
    }
    catch (error) {
        throw error;
    }
};
export default authentication;
//# sourceMappingURL=auth.middleware.js.map