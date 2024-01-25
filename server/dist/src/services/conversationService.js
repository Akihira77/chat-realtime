import { and, asc, eq, or } from "drizzle-orm";
import { messages } from "../db/schema.js";
import { db } from "../db/index.js";
class ConversationService {
    async getAllMyConversations(senderId) {
        try {
            const conversations = await db.select().from(messages).where(eq(messages.senderId, senderId));
            return conversations;
        }
        catch (error) {
            throw error;
        }
    }
    async findConversationAuthorAndRecipient(sender, receiver) {
        try {
            const filter1 = and(eq(messages.senderId, sender), eq(messages.receiverId, receiver));
            const filter2 = and(eq(messages.senderId, receiver), eq(messages.receiverId, sender));
            const results = await db
                .select()
                .from(messages)
                .where(or(filter1, filter2));
            const conversation = results[0];
            return conversation;
        }
        catch (error) {
            throw error;
        }
    }
    async getMessagesAuthorAndRecipient(sender, receiver) {
        try {
            await this.updateReadFlag(receiver, sender);
            const filter1 = and(eq(messages.senderId, sender), eq(messages.receiverId, receiver));
            const filter2 = and(eq(messages.senderId, receiver), eq(messages.receiverId, sender));
            const results = await db
                .select()
                .from(messages)
                .where(or(filter1, filter2))
                .orderBy(asc(messages.createdAt));
            const conversation = results[0];
            return conversation;
        }
        catch (error) {
            throw error;
        }
    }
    async upsert({ sender, receiver, message }) {
        try {
            const results = await db.insert(messages).values({
                senderId: sender,
                receiverId: receiver,
                message,
                createdAt: new Date()
            }).returning();
            const savedMessage = results[0];
            return savedMessage;
        }
        catch (error) {
            throw error;
        }
    }
    async chat(sender, receiver, message) {
        try {
            const results = await db.insert(messages).values({
                senderId: sender,
                receiverId: receiver,
                message,
                createdAt: new Date()
            }).returning();
            const savedMessage = results[0];
            return savedMessage.id;
        }
        catch (error) {
            throw error;
        }
    }
    async updateReadFlag(senderId, receiverId) {
        try {
            const filter = and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId));
            await db
                .update(messages)
                .set({
                isRead: true
            })
                .where(filter);
        }
        catch (error) {
            throw error;
        }
    }
}
export default ConversationService;
//# sourceMappingURL=conversationService.js.map