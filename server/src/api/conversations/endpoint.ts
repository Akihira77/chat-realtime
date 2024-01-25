import { Hono } from "hono";
import authentication from "../middlewares/auth.middleware.js";
import * as conversationHandler from "./handler.js";

const conversationEndpoint = new Hono();

conversationEndpoint
    .use("*", authentication)
    .get("/contacts", conversationHandler.findAllContactRelations)
    .get("/get-my-conversations", conversationHandler.findAllMyConversations)
    .get(
        "/:receiverId",
        conversationHandler.findConversationBetweenSenderAndReceiver
    )
    .put("/update-reads", conversationHandler.updateReadFlag);

export default conversationEndpoint;
