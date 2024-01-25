import { pgTable, bigserial, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
export const users = pgTable('Users', {
    id: varchar('id').primaryKey().$defaultFn(() => uuidv4()),
    fullName: varchar('full_name', { length: 25 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 16 }).unique().notNull(),
    lastOnline: timestamp("last_online", { withTimezone: false }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull(),
});
export const messages = pgTable("Messages", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    message: varchar("message", { length: 31267 }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    senderId: varchar("sender_id", { length: 36 }).notNull().references(() => users.id),
    receiverId: varchar("receiver_id", { length: 36 }).notNull().references(() => users.id),
    isRead: boolean("is_read").notNull().default(false)
});
//# sourceMappingURL=schema.js.map