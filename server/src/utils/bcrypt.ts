import bcrypt from "bcrypt";

export async function hashPassword(passwordRequest: string) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(passwordRequest, salt);

    return password;
}

export async function comparePassword(
    passwordRequest: string,
    actualPassword: string
) {
    const result = await bcrypt.compare(passwordRequest, actualPassword);

    return result;
}
