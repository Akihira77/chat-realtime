import { Context } from "hono";
import { JwtAuthPayload } from "../../utils/jwt.js";
import UserService from "../../services/userService.js";
import ConversationService from "../../services/conversationService.js";
import { StatusCodes } from "../../utils/constants.js";
import { zValidator } from "@hono/zod-validator";
import { ConversationParamsDTO } from "../../db/dtos/conversation/index.dto.js";
import { ZValidationAPIError } from "../../errors/index.error.js";
import { SenderAndReceiverBody } from "../../db/dtos/conversation/shared.dto.js";
import { File } from "buffer";

const userService = new UserService();
const conversationService = new ConversationService();

export const findAllContactRelations = async (context: Context) => {
    try {
        // const { userId } = context.get("user") as JwtAuthPayload;
        const contacts = await userService.getAll();

        context.status(StatusCodes.Ok200);
        return context.json({ contacts });
    } catch (error) {
        throw error;
    }
};

export const findAllMyConversations = async (context: Context) => {
    try {
        const user = context.get("user") as JwtAuthPayload;
        const conversations = await conversationService.getAllMyConversations(
            user.userId
        );

        context.status(StatusCodes.Ok200);

        return context.json({ conversations });
    } catch (error) {
        throw error;
    }
};

export const findConversationBetweenSenderAndReceiver = zValidator(
    "param",
    ConversationParamsDTO,
    async (validation, context: Context) => {
        try {
            if (!validation.success) {
                throw new ZValidationAPIError(validation.error);
            }

            const { userId: sender } = context.get("user") as JwtAuthPayload;
            const { receiverId } = validation.data;
            const receiver = await userService.getById(receiverId);

            const conversations =
                await conversationService.getMessagesAuthorAndRecipient(
                    sender,
                    receiverId
                );

            context.status(StatusCodes.Ok200);

            return context.json({
                receiver,
                conversations
            });
        } catch (error) {
            throw error;
        }
    }
);

export const updateReadFlag = zValidator(
    "json",
    SenderAndReceiverBody,
    async (validation, context: Context) => {
        try {
            if (!validation.success) {
                throw new ZValidationAPIError(validation.error);
            }

            const { senderId, receiverId } = validation.data;

            await conversationService.updateReadFlag(senderId, receiverId);

            return context.status(StatusCodes.Accepted202);
        } catch (error) {
            throw error;
        }
    }
);
