import { eq, sql } from "drizzle-orm";
import {
    UserDTO,
    RegisterRequestDtoType,
    LoginRequestDtoType,
    UpdateUserDtoType
} from "../db/dtos/user/index.dto.js";
import { db } from "../db/index.js";
import { jwtSign } from "../utils/jwt.js";
import { messages, users } from "../db/schema.js";

class UserService {
    async getAll(): Promise<UserDTO[]> {
        try {
            const rows: UserDTO[] = await db
                .select({
                    id: users.id,
                    fullName: users.fullName,
                    phoneNumber: users.phoneNumber,
                    messages: sql<number>`cast(count(CASE WHEN ${messages.unread} THEN 1 END) as int)`,
                    lastOnline: users.lastOnline
                })
                .from(users)
                .leftJoin(messages, eq(users.id, messages.senderId))
                .groupBy(users.id, users.fullName, users.phoneNumber);

            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(userId: string): Promise<UserDTO | undefined> {
        try {
            const results: UserDTO[] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            return results[0];
        } catch (error) {
            throw error;
        }
    }

    async getByPhoneNumber(phoneNumber: string): Promise<UserDTO | undefined> {
        try {
            const results: UserDTO[] = await db
                .select()
                .from(users)
                .where(eq(users.phoneNumber, phoneNumber))
                .limit(1);

            return results[0];
        } catch (error) {
            throw error;
        }
    }

    async register({
        fullName,
        phoneNumber
    }: RegisterRequestDtoType): Promise<UserDTO> {
        try {
            const results = await db
                .insert(users)
                .values({
                    fullName,
                    phoneNumber,
                    lastOnline: new Date(),
                    createdAt: new Date()
                })
                .returning();

            const savedUser = results[0]!;

            return savedUser;
        } catch (error) {
            throw error;
        }
    }

    async login(
        userId: string,
        fullName: string,
        { phoneNumber }: LoginRequestDtoType
    ): Promise<string> {
        try {
            const token = jwtSign({ userId, phoneNumber, fullName });

            return token;
        } catch (error) {
            throw error;
        }
    }

    async updateLastOnline(userId: string): Promise<void> {
        try {
            await db
                .update(users)
                .set({
                    lastOnline: new Date()
                })
                .where(eq(users.id, userId));
        } catch (error) {
            throw error;
        }
    }

    async update(
        userId: string,
        { fullName, phoneNumber }: UpdateUserDtoType
    ): Promise<boolean> {
        try {
            const result = await db
                .update(users)
                .set({
                    fullName,
                    phoneNumber
                })
                .where(eq(users.id, userId));

            return result.count > 0;
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: string): Promise<boolean> {
        try {
            const result = await db.delete(users).where(eq(users.id, userId));

            return result.count > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
