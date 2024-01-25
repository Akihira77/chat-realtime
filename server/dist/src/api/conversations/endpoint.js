import { Hono } from "hono";
import authentication from "../middlewares/auth.middleware.js";
import UserService from "../../services/userService.js";
import ConversationService from "../../services/conversationService.js";
import * as conversationHandler from "./handler.js";
const conversationEndpoint = new Hono();
const userService = new UserService();
const conversationService = new ConversationService();
conversationEndpoint
    .use("*", authentication)
    .get("/contacts", conversationHandler.findAllContactRelations)
    .get("/get-my-conversations", conversationHandler.findAllMyConversations)
    .get("/:receiverId", conversationHandler.findConversationBetweenSenderAndReceiver)
    .put("/update-reads", conversationHandler.updateReadFlag);
export default conversationEndpoint;
//# sourceMappingURL=endpoint.js.map