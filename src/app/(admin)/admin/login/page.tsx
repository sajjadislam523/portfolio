import { LoginForm } from "@/app/(admin)/admin/login/LoginForm";
import { Suspense } from "react";

export const metadata = { title: "Admin Login" };

// Wrap in Suspense — required because LoginForm uses useSearchParams()
// Without this, the page won't hydrate correctly on first load via IP
export default function AdminLoginPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="min-h-screen flex items-center justify-center"
                    style={{ background: "var(--bg-primary)" }}
                >
                    <div
                        className="w-6 h-6 rounded-full border-2 animate-spin"
                        style={{
                            borderColor: "var(--border)",
                            borderTopColor: "var(--accent)",
                        }}
                    />
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
