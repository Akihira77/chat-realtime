import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: "./.env" });
}
else {
    dotenv.config();
}
export const { DB_POSTGRES, JWT_SECRET, PORT, WS_PORT, NODE_ENV, SECRET_SIGN_COOKIES, } = process.env;
//# sourceMappingURL=env.js.map