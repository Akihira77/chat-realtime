export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            WS_PORT: string;
            JWT_SECRET: string;
            DB_POSTGRES: string;
            SECRET_SIGN_COOKIES: string;
            NODE_ENV: "development" | "production";
        }
    }
}
