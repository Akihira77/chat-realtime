import { Hono } from "hono";
import authentication from "../middlewares/auth.middleware.js";
import * as userHandler from "./handler.js";
const userEndpoint = new Hono();
userEndpoint.post("/auth/register", userHandler.register);
userEndpoint.post("/auth/login", userHandler.login);
userEndpoint.get("/auth/status", authentication, userHandler.userStatus);
userEndpoint.get("", authentication, userHandler.getAllMessageForMe);
export default userEndpoint;
//# sourceMappingURL=endpoint.js.map