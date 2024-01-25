import bcrypt from "bcrypt";
export async function hashPassword(passwordRequest) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(passwordRequest, salt);
    return password;
}
export async function comparePassword(passwordRequest, actualPassword) {
    const result = await bcrypt.compare(passwordRequest, actualPassword);
    return result;
}
//# sourceMappingURL=bcrypt.js.map