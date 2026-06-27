import { AUTH_COOKIE } from "@/lib/auth/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const proto =
        request.headers.get("x-forwarded-proto") ??
        new URL(request.url).protocol.replace(":", "");
    const isHttps = proto === "https";

    const cookieValue = [
        `${AUTH_COOKIE}=`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=0",
        ...(isHttps ? ["Secure"] : []),
    ].join("; ");

    const response = Response.json({ message: "Logged out" }, { status: 200 });
    response.headers.set("Set-Cookie", cookieValue);
    return response;
}
