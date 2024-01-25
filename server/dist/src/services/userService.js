import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { jwtSign } from "../utils/jwt.js";
import { messages, users } from "../db/schema.js";
class UserService {
    async getAll(userId) {
        try {
            const results = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .leftJoin(messages, eq(users.id, messages.receiverId));
            return results;
        }
        catch (error) {
            throw error;
        }
    }
    async getById(userId) {
        try {
            const results = await db.select().from(users).where(eq(users.id, userId)).limit(1);
            return results[0];
        }
        catch (error) {
            throw error;
        }
    }
    async getByPhoneNumber(phoneNumber) {
        try {
            const results = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber)).limit(1);
            return results[0];
        }
        catch (error) {
            throw error;
        }
    }
    async register({ fullName, phoneNumber }) {
        try {
            const results = await db.insert(users).values({
                fullName, phoneNumber, createdAt: new Date()
            }).returning();
            const savedUser = results[0];
            return savedUser;
        }
        catch (error) {
            throw error;
        }
    }
    async login(userId, fullName, { phoneNumber }) {
        try {
            const token = jwtSign({ userId, phoneNumber, fullName });
            return token;
        }
        catch (error) {
            throw error;
        }
    }
    async updateLastOnline(userId) {
        try {
            await db
                .update(users)
                .set({
                lastOnline: new Date()
            })
                .where(eq(users.id, userId));
        }
        catch (error) {
            throw error;
        }
    }
}
export default UserService;
//# sourceMappingURL=userService.js.map