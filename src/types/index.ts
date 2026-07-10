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
export type SkillProficiency = "expert" | "proficient" | "familiar";
export type MessageStatus = "unread" | "read" | "archived";
export type ThemeName = "midnight" | "ocean" | "sunset" | "matrix" | "aurora";

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
    order: number;
}

export interface ISkill {
    _id: string;
    name: string;
    category: SkillCategory;
    proficiency: SkillProficiency;
    projects: string[];
    order: number;
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
    url: string;
    label: string;
    filename: string;
    size: number;
    uploadedAt: string;
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
    activeTheme: ThemeName;
    availableForWork: boolean;
    socialLinks: ISocialLink[];
    seo: ISEOSettings;
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

// ─── Theme Types ──────────────────────────────────────────────────────────────

export interface ThemeTokens {
    bgPrimary: string;
    bgSecondary: string;
    bgElevated: string;
    bgSubtle: string;
    border: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    accent: string;
    accentGlow: string;
    accentForeground: string;
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
