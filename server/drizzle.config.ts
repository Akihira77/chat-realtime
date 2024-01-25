import "dotenv/config.js";
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DB_POSTGRES!
    }
} satisfies Config;