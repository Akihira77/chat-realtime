export function getCookie(cookie: string, target: string) {
    const cookieValue = cookie
        .split("; ")
        .find((row) => row.startsWith(`${target}=`))
        ?.split("=")[1];

    return cookieValue ?? "";
}
