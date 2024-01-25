import "dotenv/config.js";
export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DB_POSTGRES
    }
};
//# sourceMappingURL=drizzle.config.js.map