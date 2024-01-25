import { DB_POSTGRES } from "../config/env.js";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema.js";
const connectionString = DB_POSTGRES;
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });
//# sourceMappingURL=index.js.map