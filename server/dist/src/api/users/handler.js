import { validateRegisterRequest } from "../../db/dtos/user/register.dto.js";
import { CustomAPIError, ValidationAPIError } from "../../errors/index.error.js";
import { StatusCodes } from "../../utils/constants.js";
import UserService from "../../services/userService.js";
import { setCookie } from "hono/cookie";
import { validateLoginRequest } from "../../db/dtos/user/login.dto.js";
const userService = new UserService();
export const register = async (context) => {
    try {
        const body = await context.req.json();
        const validationResult = validateRegisterRequest(body);
        if (!validationResult.success) {
            throw new ValidationAPIError(validationResult.errors);
        }
        const result = await userService.register(body);
        context.status(StatusCodes.Created201);
        return context.json({ user: result });
    }
    catch (error) {
        throw error;
    }
};
export const login = async (context) => {
    try {
        const body = await context.req.json();
        const validationResult = validateLoginRequest(body);
        if (!validationResult.success) {
            throw new ValidationAPIError(validationResult.errors);
        }
        const { phoneNumber } = body;
        const existedUser = await userService.getByPhoneNumber(phoneNumber);
        if (!existedUser) {
            throw new CustomAPIError("User does not found", StatusCodes.NotFound404);
        }
        const token = await userService.login(existedUser.id, existedUser.fullName, body);
        setCookie(context, "token", token, { httpOnly: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000, path: "/" });
        context.status(StatusCodes.Ok200);
        return context.json({ token });
    }
    catch (error) {
        throw error;
    }
};
export const userStatus = async (context) => {
    try {
        const userSession = context.get("user");
        const userFromDb = await userService.getById(userSession.userId);
        context.status(StatusCodes.Ok200);
        return context.json({
            id: userFromDb?.id,
            fullName: userFromDb?.fullName,
            phoneNumber: userFromDb?.phoneNumber,
        });
    }
    catch (error) {
        throw error;
    }
};
export const getAllMessageForMe = async (context) => {
    try {
        const { userId } = context.get("user");
        const results = await userService.getAll(userId);
        context.status(StatusCodes.Ok200);
        return context.json({ users: results });
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=handler.js.map