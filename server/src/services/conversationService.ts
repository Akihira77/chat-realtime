import { and, asc, eq, or, sql } from "drizzle-orm";
import { messageFiles, messages } from "../db/schema.js";
import { db } from "../db/index.js";
import {
    compressText,
    convertBufferToString,
    decompressText
} from "../utils/compress-data.js";
import { ChatRequestDtoType } from "../db/dtos/conversation/shared.dto.js";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { promisify } from "util";
import * as path from "path";

const writeAsync = promisify(fs.writeFile);

class ConversationService {
    async getAllMyConversations(senderId: string) {
        try {
            const conversations = await db
                .select({
                    messages,
                    messageFiles
                })
                .from(messages)
                .where(eq(messages.senderId, senderId))
                .leftJoin(
                    messageFiles,
                    eq(messages.id, messageFiles.messageId)
                );

            let convertedConversations = [];
            for (let i = 0; i < conversations.length; i++) {
                let conversation = conversations[i]!;
                let newConverted: any;
                if (conversation.messages.message) {
                    const compressedText = await decompressText(
                        conversation.messages.message
                    );

                    newConverted = {
                        ...conversation,
                        message: convertBufferToString(compressedText)
                    };
                }

                convertedConversations.push(newConverted);
            }

            return conversations;
        } catch (error) {
            throw error;
        }
    }

    async findConversationAuthorAndRecipient(sender: string, receiver: string) {
        try {
            const filter1 = and(
                eq(messages.senderId, sender),
                eq(messages.receiverId, receiver)
            );
            const filter2 = and(
                eq(messages.senderId, receiver),
                eq(messages.receiverId, sender)
            );

            const results = await db
                .select()
                .from(messages)
                .where(or(filter1, filter2));

            return results;
        } catch (error) {
            throw error;
        }
    }

    async getMessagesAuthorAndRecipient(sender: string, receiver: string) {
        try {
            await this.updateReadFlag(receiver, sender);
            const filter1 = and(
                eq(messages.senderId, sender),
                eq(messages.receiverId, receiver)
            );
            const filter2 = and(
                eq(messages.senderId, receiver),
                eq(messages.receiverId, sender)
            );

            const results = await db
                .select()
                .from(messages)
                .where(or(filter1, filter2))
                .orderBy(asc(messages.createdAt));

            return results;
        } catch (error) {
            throw error;
        }
    }

    async chat(request: ChatRequestDtoType) {
        type Payload = {
            senderId: string;
            receiverId: string;
            message?: Buffer;
            createdAt: Date;
        };

        try {
            const { senderId, receiverId, content, files } = request;
            const result = await db.transaction(async (tx) => {
                if (!(content || files)) {
                    throw new Error("Text or File message is required");
                }

                let payload: Payload = {
                    senderId,
                    receiverId,
                    createdAt: new Date()
                };
                if (content) {
                    const compressedMessage = await compressText(content);

                    payload.message = compressedMessage;
                }

                const savedMessages = await tx
                    .insert(messages)
                    .values(payload)
                    .returning();
                const savedMessage = savedMessages[0]!;

                if (!files) {
                    return { messageId: savedMessage.id, savedFiles: [] };
                }

                const fileType = await fileTypeFromBuffer(files);
                if (!fileType) {
                    return { messageId: savedMessage.id, savedFiles: [] };
                }

                const fileName = `file_${Date.now()}.${fileType.ext}`;
                const directory: string = path.resolve();
                const filePath = path.join(
                    directory,
                    "/server/public/files/",
                    fileName
                );

                await writeAsync(filePath, files);

                await tx.insert(messageFiles).values({
                    fileName,
                    fileType: fileType.ext,
                    messageId: savedMessage.id,
                    senderId
                });

                return { messageId: savedMessage.id, savedFiles: [fileName] };
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateReadFlag(senderId: string, receiverId: string) {
        try {
            const filter = and(
                eq(messages.senderId, senderId),
                eq(messages.receiverId, receiverId)
            );

            await db
                .update(messages)
                .set({
                    unread: false
                })
                .where(filter);
        } catch (error) {
            throw error;
        }
    }
}

export default ConversationService;
