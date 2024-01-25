import { Context } from "hono";
import {
    CustomAPIError,
    ZValidationAPIError
} from "../../errors/index.error.js";
import { StatusCodes } from "../../utils/constants.js";
import UserService from "../../services/userService.js";
import { setCookie } from "hono/cookie";
import {
    LoginRequestDTO,
    RegisterRequestDTO
} from "../../db/dtos/user/index.dto.js";
import { JwtAuthPayload } from "../../utils/jwt.js";
import { zValidator } from "@hono/zod-validator";

const userService = new UserService();

export const register = zValidator(
    "json",
    RegisterRequestDTO,
    async (validation, context: Context) => {
        try {
            if (!validation.success) {
                throw new ZValidationAPIError(validation.error);
            }

            const body = validation.data;

            const result = await userService.register(body);
            context.status(StatusCodes.Created201);

            return context.json({ user: result });
        } catch (error) {
            throw error;
        }
    }
);

export const login = zValidator(
    "json",
    LoginRequestDTO,
    async (validation, context: Context) => {
        try {
            if (!validation.success) {
                throw new ZValidationAPIError(validation.error);
            }

            const body = validation.data;
            const { phoneNumber } = body;
            const existedUser = await userService.getByPhoneNumber(phoneNumber);

            if (!existedUser) {
                throw new CustomAPIError(
                    "User does not found",
                    StatusCodes.NotFound404
                );
            }

            const token = await userService.login(
                existedUser.id,
                existedUser.fullName,
                body
            );

            setCookie(context, "token", token, {
                maxAge: /*10 * 365 * 24 * */ 60 * 60 * 1000,
                path: "/"
            });

            context.status(StatusCodes.Ok200);

            return context.json({ token });
        } catch (error) {
            throw error;
        }
    }
);

export const userStatus = async (context: Context) => {
    try {
        const userSession = context.get("user") as JwtAuthPayload;
        const userFromDb = await userService.getById(userSession.userId);

        context.status(StatusCodes.Ok200);

        return context.json({
            id: userFromDb?.id,
            fullName: userFromDb?.fullName,
            phoneNumber: userFromDb?.phoneNumber
        });
    } catch (error) {
        throw error;
    }
};

export const getAllMessageForMe = async (context: Context) => {
    try {
        // const { userId } = context.get("user") as JwtAuthPayload;
        // console.log(userId);
        const results = await userService.getAll();

        context.status(StatusCodes.Ok200);

        return context.json({ users: results });
    } catch (error) {
        throw error;
    }
};
