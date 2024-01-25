import {
    pgTable,
    bigserial,
    boolean,
    timestamp,
    varchar,
    customType
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

const customBytea = customType<{ data: Buffer }>({
    dataType() {
        return "bytea";
    }
});

export const users = pgTable("Users", {
    id: varchar("id")
        .primaryKey()
        .$defaultFn(() => uuidv4()),
    fullName: varchar("full_name", { length: 25 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 16 }).unique().notNull(),
    lastOnline: timestamp("last_online", { withTimezone: false }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull()
});

export const messages = pgTable("Messages", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    message: customBytea("message"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    senderId: varchar("sender_id", { length: 36 })
        .notNull()
        .references(() => users.id),

    receiverId: varchar("receiver_id", { length: 36 })
        .notNull()
        .references(() => users.id),

    unread: boolean("unread").notNull().default(true)
});

export const messageFiles = pgTable("Message_Files", {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    fileName: varchar("file_url", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 50 }).notNull(),

    messageId: bigserial("message_id", { mode: "number" })
        .notNull()
        .references(() => messages.id),

    senderId: varchar("sender_id", { length: 36 })
        .notNull()
        .references(() => users.id)
});
