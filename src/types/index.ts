// ─── Domain Types ────────────────────────────────────────────────────────────
// Single source of truth for all data shapes used across public site + admin.
// Every Mongoose model maps 1-to-1 with one of these interfaces.

export type ProjectStatus = "featured" | "archived";
export type SkillCategory =
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "tooling";
// A technology's place in the stack, not how well it's known in the
// abstract — "how central is this to daily work" (Core), "used capably but
// not primary" (Working knowledge), or "currently being adopted" (Exploring).
// Distinct from `ExplorationStatus`: a stack tier describes a *technology*,
// an exploration describes an *activity* (a project, a line of learning).
export type SkillTier = "core" | "working-knowledge" | "exploring";
export type MessageStatus = "unread" | "read" | "archived";
// "active" is the only status eligible for the public site — experimenting
// and completed explorations are backstage-only. "completed" is what used
// to be called "archived" before the CMS redesign added a real 3-stage
// workflow (see scripts/migrate-exploration-status.ts for the migration).
export type ExplorationStatus = "active" | "experimenting" | "completed";

export interface IProject {
    _id: string;
    slug: string;
    title: string;
    tagline: string;
    overview: string;
    challenges: string;
    solutions: string;
    architectureDiagram?: string;
    technologies: string[];
    coverImage?: string;
    images?: string[];
    links: {
        live?: string;
        github?: string;
    };
    status: ProjectStatus;
    /** Shown in the ledger's meta rail — "Full stack", "Frontend", "Lead". */
    role: string;
    /** Hand-picked lead row on the projects section. One project at a time. */
    featured: boolean;
    /** Draft gate — unpublished projects never reach the public query,
     *  regardless of status/featured. */
    published: boolean;
    order: number;
    year: number;
    createdAt: string;
    updatedAt: string;
}

export interface IExperience {
    _id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
    accomplishments: string[];
    technologies: string[];
    published: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface ISkill {
    _id: string;
    name: string;
    category: SkillCategory;
    tier: SkillTier;
    icon?: string;
    description?: string;
    /** Draft/hide gate — distinct from `tier`, which describes proficiency
     *  stage, not whether the entry shows on the public site at all. */
    visible: boolean;
    projects: string[];
    order: number;
}

export interface IExploration {
    _id: string;
    title: string;
    /** Short — one or two sentences, not the project's full writeup. */
    description: string;
    topics: string[];
    status: ExplorationStatus;
    startDate: string;
    link?: string;
    image?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    /** Singleton — at most one exploration is primary at a time (enforced
     *  in the server action, same pattern as IProject.featured). Drives
     *  which item the public section leads with; the rest are secondary. */
    isPrimary: boolean;
    /** Draft gate, independent of `status` — an exploration can be marked
     *  Active in the CMS but kept unpublished while it's still being written up. */
    published: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICertification {
    _id: string;
    name: string;
    issuer: string;
    year: number;
    credentialUrl?: string;
    order: number;
}

export interface ISocialLink {
    platform: string;
    url: string;
    icon?: string;
}

export interface ISEOSettings {
    title: string;
    description: string;
    ogImage: string;
    keywords: string[];
}

export interface IResumeVersion {
    /** Present on every version uploaded after the resume-versioning fix;
     *  absent on legacy rows saved before per-version ids existed — actions
     *  fall back to matching by `url` for those. */
    _id?: string;
    url: string;
    label: string;
    filename: string;
    /** Vercel Blob storage path — absent on legacy rows. */
    pathname?: string;
    /** Sequential upload counter — absent on legacy rows. */
    version?: number;
    size: number;
    uploadedAt: string;
    /** Computed (matched against ISiteSettings.resumeUrl), not stored —
     *  avoids a second source of truth that could drift from resumeUrl. */
    isActive: boolean;
}

export interface ISiteSettings {
    _id: string;
    name: string;
    tagline: string;
    bio: string;
    email: string;
    phone?: string;
    location: string;
    resumeUrl: string;
    resumeVersions: IResumeVersion[];
    avatarUrl?: string;
    availableForWork: boolean;
    socialLinks: ISocialLink[];
    seo: ISEOSettings;
}

export interface IMedia {
    _id: string;
    url: string;
    pathname: string;
    filename: string;
    type: string;
    size: number;
    purpose: string;
    uploadedAt: string;
}

export interface IContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: MessageStatus;
    createdAt: string;
}

export interface IUser {
    _id: string;
    email: string;
    role: "admin";
    createdAt: string;
    lastLogin: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface JWTPayload {
    userId: string;
    email: string;
    role: "admin";
    iat?: number;
    exp?: number;
}

export interface AuthSession {
    userId: string;
    email: string;
    role: "admin";
}
