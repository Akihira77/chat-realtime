export function getCookie(cookie, target) {
    const cookieValue = cookie
        .split("; ")
        .find((row) => row.startsWith(`${target}=`))
        ?.split("=")[1];
    return cookieValue ?? "";
}
//# sourceMappingURL=cookie.js.map