import uWS, {
    HttpRequest,
    HttpResponse,
    us_socket_context_t,
    WebSocket
} from "uWebSockets.js";
import { getCookie } from "./utils/cookie.js";
import { jwtVerify } from "./utils/jwt.js";
import { CustomAPIError } from "./errors/index.error.js";
import { StatusCodes } from "./utils/constants.js";
import ConversationService from "./services/conversationService.js";
import UserService from "./services/userService.js";
import redis from "redis";
import { compressText } from "./utils/compress-data.js";
import { Buffer } from "buffer";
import { deserialize } from "v8";

type uWSPayload = {
    userId: string;
    username: string;
};

// type MessagePayload = {
// 	author: { id: string; fullName: string };
// 	content: string;
// 	messageId: number;
// };

// const clients: Map<string | undefined, WebSocket<uWSPayload>> = new Map();
const clients = await redis
    .createClient({})
    .on("error", (err: unknown) => console.log("Redis Client Error", err))
    .connect();

const conversationService = new ConversationService();
const userService = new UserService();

export function startSocket() {
    return uWS.App().ws("/api/conversations", {
        idleTimeout: 120,
        maxBackpressure: 64 * 1024,
        maxPayloadLength: 16 * 1024 * 1024,
        compression: uWS.SHARED_COMPRESSOR,
        sendPingsAutomatically: true,
        maxLifetime: 60,

        upgrade: (
            res: HttpResponse,
            req: HttpRequest,
            context: us_socket_context_t
        ) => {
            const secWebSocketKey = req.getHeader("sec-websocket-key");
            const secWebSocketProtocol = req.getHeader(
                "sec-websocket-protocol"
            );
            const secWebSocketExtensions = req.getHeader(
                "sec-websocket-extensions"
            );
            let cookie = req.getHeader("cookie");

            while (cookie === "") {
                cookie = req.getHeader("cookie");
            }

            try {
                const token = getCookie(cookie, "token");
                const { userId, fullName: username } = jwtVerify(token);
                const uwsPayload: uWSPayload = {
                    userId,
                    username
                };

                res.upgrade(
                    uwsPayload,
                    secWebSocketKey,
                    secWebSocketProtocol,
                    secWebSocketExtensions,
                    context
                );
            } catch (error) {
                console.log(error);
                throw new CustomAPIError(
                    "Upgraded Connection Failed",
                    StatusCodes.InternalServerError500
                );
            }
        },

        open: async (ws: WebSocket<uWSPayload>) => {
            const { userId, username } = ws.getUserData();
            console.log("A WebSocket connected with Data: ", userId, username);

            if (!ws.isSubscribed(userId)) {
                ws.subscribe(userId);
            }
        },

        message: async (ws: WebSocket<uWSPayload>, message: ArrayBuffer) => {
            try {
                const { userId, username } = ws.getUserData();
                const str = new TextDecoder().decode(message);
                const { type, receiver, content, files } = JSON.parse(str);

                const keys: [string, string] = [
                    `${userId} & ${receiver}`,
                    `${receiver} & ${userId}`
                ];

                if (type === "START") {
                    await handleStart(keys, ws, userId, receiver);
                } else if (type === "SENDING-CHAT") {
                    await handleSendMessageToOneChannel(
                        keys,
                        ws,
                        userId,
                        username,
                        receiver,
                        content,
                        files
                    );

                    notification(ws, receiver, userId);
                }
            } catch (error) {
                console.log(error);
                throw new CustomAPIError(
                    "Get an Error when processing message",
                    StatusCodes.InternalServerError500
                );
            }
        },

        close: async (ws: WebSocket<uWSPayload>, code: number) => {
            const { userId } = ws.getUserData();

            console.log(
                `Client ${userId} disconnected from socket. LastOnline ${new Date()}; Code: ${code}`
            );

            // clients.delete(userId);
            await userService.updateLastOnline(userId);
        }
    });
}

async function handleStart(
    keys: [string, string],
    ws: WebSocket<uWSPayload>,
    sender: string,
    receiver: string
) {
    // clean subscribed channel except channel for chat
    // and channel for sending notification
    handleUnsubscribe(ws, [sender, receiver]);

    let room = (await clients.get(keys[0])) || (await clients.get(keys[1]));

    if (!room) {
        await clients.set(keys[0], keys[1]);
        room = keys[1];
    }

    handleSubscribe(ws, [sender, receiver, room]);
}

async function handleSendMessageToOneChannel(
    keys: [string, string],
    ws: WebSocket<uWSPayload>,
    senderId: string,
    username: string,
    receiverId: string,
    content?: string,
    files?: Buffer
) {
    try {
        let dataFromClient = {
            senderId,
            receiverId,
            content,
            files
        };

        if (files) {
            const deserializedFile = deserialize(files);
            dataFromClient.files = deserializedFile;
        }

        const room = ((await clients.get(keys[0])) ||
            (await clients.get(keys[1])))!;

        const { messageId, savedFiles } =
            await conversationService.chat(dataFromClient);

        const payload = JSON.stringify({
            type: "RECEIVE-CHAT",
            sender: {
                id: senderId,
                name: username
            },
            content: content ? await compressText(content) : undefined,
            files: savedFiles,
            messageId
        });

        ws.publish(room, payload);
    } catch (error) {
        console.log(error);
        throw new CustomAPIError(
            "Server Error",
            StatusCodes.InternalServerError500
        );
    }
}

function handleUnsubscribe(ws: WebSocket<uWSPayload>, exception: string[]) {
    try {
        const topics = ws.getTopics();
        topics.forEach((topic) => {
            if (!exception.includes(topic)) {
                ws.unsubscribe(topic);
            }
        });
    } catch (error) {
        console.log(error);
        throw new CustomAPIError("Socket is closed", StatusCodes.BadRequest400);
    }
}

function handleSubscribe(ws: WebSocket<uWSPayload>, topics: string[]) {
    try {
        topics.forEach((topic) => {
            if (!ws.isSubscribed(topic)) {
                ws.subscribe(topic);
            }
        });
    } catch (error) {
        console.log(error);
        throw new CustomAPIError("Socket is closed", StatusCodes.BadRequest400);
    }
}

function notification(
    ws: WebSocket<uWSPayload>,
    receiver: string,
    sender: string
) {
    const payload = {
        type: "NOTIFICATION",
        senderId: sender,
        receiverId: receiver
    };

    if (ws.isSubscribed(receiver)) {
        ws.publish(receiver, JSON.stringify(payload));
    } else {
        console.log("Cannot sending because not subscribed to this channel");
    }
}
