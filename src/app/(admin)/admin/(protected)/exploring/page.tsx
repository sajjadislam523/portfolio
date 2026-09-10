import { requireSession } from "@/features/auth/session";
import { getExplorations } from "@/features/exploring/actions";
import { PageHeader } from "@/components/admin/PageHeader";
import { ExploringManager } from "./ExploringManager";

export const metadata = { title: "Currently Exploring" };

export default async function AdminExploringPage() {
    await requireSession();
    const explorations = await getExplorations();

    return (
        <div className="max-w-3xl">
            <PageHeader
                title="Currently Exploring"
                description="What you're actively learning, experimenting with, or building — separate from your technology stack"
            />
            <ExploringManager explorations={explorations} />
        </div>
    );
}
