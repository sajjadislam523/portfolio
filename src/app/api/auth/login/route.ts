import { AUTH_COOKIE, signToken } from "@/lib/auth/jwt";
import { connectDB, User } from "@/lib/db";
import { apiError } from "@/lib/utils";
import { loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return apiError("Invalid email or password format", 400);
        }

        const { email, password } = parsed.data;

        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            "+passwordHash",
        );

        if (!user) {
            await bcrypt.compare(
                password,
                "$2b$12$invalidhashfortimingattackprevention",
            );
            return apiError("Invalid credentials", 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return apiError("Invalid credentials", 401);
        }

        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            role: "admin",
        });

        // Detect whether the request came over HTTPS by checking the protocol
        // or the X-Forwarded-Proto header (set by reverse proxies like nginx).
        // Never use NODE_ENV for this — production can run on HTTP locally
        // and dev can run behind HTTPS tunnels.
        const proto =
            request.headers.get("x-forwarded-proto") ??
            new URL(request.url).protocol.replace(":", "");
        const isHttps = proto === "https";

        // Only set Secure flag when actually on HTTPS.
        // On plain HTTP (local IP, Docker without SSL), Secure cookies are
        // silently dropped by the browser — login appears to succeed but
        // the cookie is never saved.
        const cookieValue = [
            `${AUTH_COOKIE}=${token}`,
            "Path=/",
            "HttpOnly",
            "SameSite=Lax",
            `Max-Age=${7 * 24 * 60 * 60}`,
            ...(isHttps ? ["Secure"] : []),
        ].join("; ");

        const response = Response.json(
            { message: "Authenticated" },
            { status: 200 },
        );
        response.headers.set("Set-Cookie", cookieValue);
        return response;
    } catch (err) {
        console.error("[auth/login]", err);
        return apiError("Internal server error", 500);
    }
}
