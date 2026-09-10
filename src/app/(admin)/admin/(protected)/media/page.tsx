import { PageHeader } from "@/components/admin/PageHeader";
import { getMedia } from "@/features/media/actions";
import { requireSession } from "@/features/auth/session";
import { MediaManager } from "./MediaManager";

export const metadata = { title: "Files" };

export default async function AdminMediaPage() {
    await requireSession();
    const items = await getMedia();

    return (
        <div className="max-w-4xl">
            <PageHeader
                title="Files"
                description="Every file uploaded through the CMS, tracked so it can be reused or removed. Files uploaded before this page existed aren't listed here."
            />
            <MediaManager items={items} />
        </div>
    );
}
