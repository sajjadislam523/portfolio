import { AdminButton } from "@/components/admin/AdminButton";
import { AdminListRow } from "@/components/admin/AdminListRow";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireSession } from "@/features/auth/session";
import { getProjects } from "@/features/projects/actions";
import { formatDate } from "@/lib/utils";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectRowActions } from "./ProjectRowActions";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
    await requireSession();
    const projects = await getProjects();

    return (
        <div className="max-w-4xl">
            <PageHeader
                title="Projects"
                description="Manage your portfolio's project case studies"
                action={
                    <Link href="/admin/projects/new">
                        <AdminButton>
                            <Plus className="w-4 h-4" /> Add project
                        </AdminButton>
                    </Link>
                }
            />

            {projects.length === 0 ? (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                >
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                        No projects yet.{" "}
                        <Link href="/admin/projects/new" style={{ color: "var(--accent)" }}>
                            Add your first project
                        </Link>
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {projects.map((project, i) => (
                        <AdminListRow
                            key={project._id}
                            media={
                                project.coverImage ? (
                                    <div
                                        className="relative h-12 w-20 overflow-hidden rounded-md"
                                        style={{ border: "1px solid var(--border)" }}
                                    >
                                        <Image
                                            src={project.coverImage}
                                            alt=""
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="flex h-12 w-20 items-center justify-center rounded-md text-xs"
                                        style={{
                                            background: "var(--bg-subtle)",
                                            border: "1px solid var(--border)",
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        No image
                                    </div>
                                )
                            }
                            primary={project.title}
                            badges={
                                <>
                                    <StatusBadge
                                        label={project.published ? "Published" : "Draft"}
                                        tone={project.published ? "success" : "neutral"}
                                    />
                                    <StatusBadge
                                        label={project.status === "featured" ? "Showcase" : "Archive"}
                                        tone="accent"
                                    />
                                    {project.featured && (
                                        <span
                                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                                            style={{
                                                background: "rgba(124,106,247,0.12)",
                                                color: "#7C6AF7",
                                                border: "1px solid rgba(124,106,247,0.3)",
                                            }}
                                        >
                                            <Star className="h-2.5 w-2.5 fill-current" /> Lead
                                        </span>
                                    )}
                                </>
                            }
                            secondary={project.tagline}
                            meta={
                                <>
                                    {project.year}
                                    <br />
                                    Updated {formatDate(project.updatedAt)}
                                </>
                            }
                            actions={
                                <ProjectRowActions
                                    project={project}
                                    isFirst={i === 0}
                                    isLast={i === projects.length - 1}
                                />
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
