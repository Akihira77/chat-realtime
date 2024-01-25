import { DB_POSTGRES } from "../config/env.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = DB_POSTGRES!;

// for query purposes
const queryClient = postgres(connectionString, {
    max: 100,
    connect_timeout: 30,
    idle_timeout: 10
});

export const db = drizzle(queryClient, { schema, logger: true });
