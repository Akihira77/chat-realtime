import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
const SECRET_KEY = JWT_SECRET;
export function jwtSign(payload) {
    try {
        const token = jwt.sign(payload, SECRET_KEY);
        return token;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
export function jwtVerify(token) {
    try {
        const result = jwt.verify(token, SECRET_KEY);
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
//# sourceMappingURL=jwt.js.map