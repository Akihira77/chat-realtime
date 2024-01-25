import UserService from "../../services/userService.js";
import ConversationService from "../../services/conversationService.js";
import { StatusCodes } from "../../utils/constants.js";
const userService = new UserService();
const conversationService = new ConversationService();
export const findAllContactRelations = async (context) => {
    try {
        const { userId } = context.get("user");
        const contacts = await userService.getAll(userId);
        context.status(StatusCodes.Ok200);
        return context.json({ contacts });
    }
    catch (error) {
        throw error;
    }
};
export const findAllMyConversations = async (context) => {
    try {
        const user = context.get("user");
        const conversations = await conversationService.getAllMyConversations(user.userId);
        context.status(StatusCodes.Ok200);
        return context.json({ conversations });
    }
    catch (error) {
        throw error;
    }
};
export const findConversationBetweenSenderAndReceiver = async (context) => {
    try {
        const { userId: sender } = context.get("user");
        const receiver = context.req.param("receiverId");
        const recipient = await userService.getById(receiver);
        const conversations = await conversationService.getMessagesAuthorAndRecipient(sender, receiver);
        context.status(StatusCodes.Ok200);
        return context.json({
            recipient,
            conversations
        });
    }
    catch (error) {
        throw error;
    }
};
export const updateReadFlag = async (context) => {
    try {
        const { sender, receiver } = await context
            .req
            .json();
        await conversationService.updateReadFlag(sender, receiver);
        return context.status(StatusCodes.NoContent204);
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=handler.js.map