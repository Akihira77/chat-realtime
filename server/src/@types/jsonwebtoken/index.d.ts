import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
    interface JwtAuthPayload extends jwt.JwtPayload {
        userId: string;
        fullName: string;
        phoneNumber: string;
    }
}
