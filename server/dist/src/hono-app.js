import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import { errorHandler } from "./api/middlewares/errorHandler.middleware.js";
import conversationEndpoint from "./api/conversations/endpoint.js";
import userEndpoint from "./api/users/endpoint.js";
export default async function startHonoApp() {
    const app = new Hono({ strict: true });
    app.use("*", cors({
        credentials: true,
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        origin: ["http://localhost:5173"],
    }));
    app.use("*", logger());
    app.use("*", compress());
    app.route("/api/users", userEndpoint);
    app.route("/api/conversations", conversationEndpoint);
    app.onError(errorHandler);
    return app;
}
//# sourceMappingURL=hono-app.js.map