"use client";

import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/admin/dashboard";
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                toast.error(json.error ?? "Invalid credentials");
                return;
            }

            router.push(redirect);
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const inputStyle = {
        background: "var(--bg-subtle)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
    };

    const inputClass =
        "w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--accent)]";

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{ background: "var(--bg-primary)" }}
        >
            <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                        style={{
                            background: "var(--accent-glow)",
                            border: "1px solid var(--accent)",
                        }}
                    >
                        <Lock
                            className="w-5 h-5"
                            style={{ color: "var(--accent)" }}
                        />
                    </div>
                    <h1
                        className="text-xl font-semibold tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Admin access
                    </h1>
                    <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        sajjadulislam.dev
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-xl p-6"
                    style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                    }}
                >
                    {/* method="post" prevents browser GET fallback before hydration */}
                    <form
                        method="post"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="admin@example.com"
                                {...register("email")}
                                className={inputClass}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.email
                                        ? "#EF4444"
                                        : "var(--border)",
                                }}
                            />
                            {errors.email && (
                                <p
                                    className="text-xs"
                                    style={{ color: "#EF4444" }}
                                >
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={inputClass}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.password
                                        ? "#EF4444"
                                        : "var(--border)",
                                }}
                            />
                            {errors.password && (
                                <p
                                    className="text-xs"
                                    style={{ color: "#EF4444" }}
                                >
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium mt-1 transition-opacity disabled:opacity-60"
                            style={{
                                background: "var(--accent)",
                                color: "var(--accent-foreground)",
                            }}
                        >
                            {isLoading && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            {isLoading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                </div>

                <p
                    className="text-center text-xs mt-6"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    This area is restricted to the site owner.
                </p>
            </div>
        </div>
    );
}
