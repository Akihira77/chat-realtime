import uWS from "uWebSockets.js";
import { getCookie } from "./utils/cookie.js";
import { jwtVerify } from "./utils/jwt.js";
import { CustomAPIError } from "./errors/index.error.js";
import { StatusCodes } from "./utils/constants.js";
import ConversationService from "./services/conversationService.js";
import UserService from "./services/userService.js";
import redis from "redis";
const clients = await redis
    .createClient({})
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
const conversationService = new ConversationService();
const userService = new UserService();
export function startSocket() {
    return uWS.App().ws("/api/conversations", {
        idleTimeout: 32,
        maxBackpressure: 64 * 1024,
        maxPayloadLength: 16 * 1024 * 1024,
        compression: uWS.SHARED_COMPRESSOR,
        sendPingsAutomatically: true,
        maxLifetime: 60,
        upgrade: (res, req, context) => {
            const secWebSocketKey = req.getHeader("sec-websocket-key");
            const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
            const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
            let cookie = req.getHeader("cookie");
            while (cookie === "") {
                cookie = req.getHeader("cookie");
            }
            try {
                const token = getCookie(cookie, "token");
                const { userId, fullName: username } = jwtVerify(token);
                const uwsPayload = {
                    userId,
                    username
                };
                res.upgrade(uwsPayload, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context);
            }
            catch (error) {
                console.log(error);
                throw new CustomAPIError("Upgraded Connection Failed", StatusCodes.InternalServerError500);
            }
        },
        open: async (ws) => {
            const { userId, username } = ws.getUserData();
            console.log("A WebSocket connected with Data: ", userId, username);
            if (!ws.isSubscribed(userId)) {
                ws.subscribe(userId);
            }
        },
        message: async (ws, message, isBinary) => {
            try {
                const { userId, username } = ws.getUserData();
                const str = new TextDecoder().decode(message);
                const { type, receiver, content } = JSON.parse(str);
                const key1 = `${userId} & ${receiver}`;
                const key2 = `${receiver} & ${userId}`;
                if (type === "START") {
                    await handleStart(key1, key2, ws, userId, receiver);
                }
                else if (type === "SENDING-CHAT") {
                    await handleSendMessageToOneChannel(key1, key2, ws, userId, username, receiver, content);
                    notification(ws, receiver, userId);
                }
            }
            catch (error) {
                console.log(error);
                throw new CustomAPIError("Get an Error when processing message", StatusCodes.InternalServerError500);
            }
        },
        close: async (ws, code) => {
            const { userId } = ws.getUserData();
            console.log(`Client ${userId} disconnected from socket. LastOnline ${new Date()}; Code: ${code}`);
            await userService.updateLastOnline(userId);
        }
    });
}
async function handleStart(key1, key2, ws, sender, receiver) {
    handleUnsubscribe(ws, [sender, receiver]);
    let room = (await clients.get(key1)) || (await clients.get(key2));
    if (!room) {
        await clients.set(key1, key1);
        room = key1;
    }
    handleSubscribe(ws, [sender, receiver, room]);
}
async function handleSendMessageToOneChannel(key1, key2, ws, userId, username, recipient, content) {
    try {
        const room = ((await clients.get(key1)) || (await clients.get(key2)));
        const messageId = await conversationService.chat(userId, recipient, content);
        const payload = JSON.stringify({
            type: "RECEIVE-CHAT",
            sender: {
                id: userId,
                name: username
            },
            content,
            messageId: messageId
        });
        ws.publish(room, payload);
    }
    catch (error) {
        console.log(error);
        throw new CustomAPIError("Server Error", StatusCodes.InternalServerError500);
    }
}
function handleUnsubscribe(ws, exception) {
    try {
        const topics = ws.getTopics();
        topics.forEach((topic) => {
            if (!exception.includes(topic)) {
                ws.unsubscribe(topic);
            }
        });
    }
    catch (error) {
        console.log(error);
        throw new CustomAPIError("Socket is closed", StatusCodes.BadRequest400);
    }
}
function handleSubscribe(ws, topics) {
    try {
        topics.forEach((topic) => {
            if (!ws.isSubscribed(topic)) {
                ws.subscribe(topic);
            }
        });
    }
    catch (error) {
        console.log(error);
        throw new CustomAPIError("Socket is closed", StatusCodes.BadRequest400);
    }
}
function notification(ws, receiver, sender) {
    const payload = {
        type: "NOTIFICATION",
        senderId: sender,
        receiverId: receiver
    };
    if (ws.isSubscribed(receiver)) {
        ws.publish(receiver, JSON.stringify(payload));
    }
    else {
        console.log("Cannot sending because not subscribed to this channel");
    }
}
//# sourceMappingURL=uws.js.map