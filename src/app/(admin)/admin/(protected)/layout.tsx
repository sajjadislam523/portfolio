import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";

export const metadata = {
    title: { template: "%s | Admin", default: "Admin" },
    robots: { index: false, follow: false },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Double-check server-side — proxy handles it too, but defence in depth
    if (!session) {
        redirect("/admin/login");
    }

    return (
        <div
            className="flex h-screen overflow-hidden"
            style={{ background: "var(--bg-primary)" }}
        >
            <AdminSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Top bar */}
                <header
                    className="flex items-center justify-between px-6 h-14 border-b shrink-0"
                    style={{
                        background: "var(--bg-secondary)",
                        borderColor: "var(--border)",
                    }}
                >
                    <div />
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#22C55E" }}
                        />
                        <span
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            {session.email}
                        </span>
                    </div>
                </header>

                {/* Page content — only this area scrolls */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
