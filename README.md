<div align="center">

# Sajjadul Islam — Portfolio Platform

**A production-grade personal portfolio & CMS, built with Next.js, TypeScript, TailwindCSS, and MongoDB.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

[Live Site](https://sajjadulislam.vercel.app) · [Admin Panel](https://sajjadulislam.vercel.app/admin) · [Report a Bug](https://github.com/sajjadulislam523/portfolio/issues)

</div>

This isn't a template — it's a custom-built portfolio platform: a public site, a password-protected admin CMS, a light/dark theme toggle, and a command palette. The design language draws on Linear, Vercel, Stripe, and Raycast.

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Admin panel](#admin-panel)
- [Command palette](#command-palette)
- [Project structure](#project-structure)
- [Local dev workflow](#local-dev-workflow)
- [License](#license)

## Features

### Public site

- Editorial hero with a terminal-style code card and live stats
- Project pages with overview, challenges, solutions, and tech stack per project
- Interactive experience timeline
- Categorized tech stack with proficiency levels (Expert / Proficient / Familiar)
- Contact form that writes straight to a MongoDB inbox
- Command palette (`⌘K` / `Ctrl+K`) for navigation and theme switching
- Light/dark theme toggle — visitor-controlled, remembered per browser, no flash of the wrong theme on load

### Admin CMS

Everything under `/admin`, protected by JWT auth:

| Section | What it manages |
| --- | --- |
| **Projects** | Full CRUD — slug, tagline, overview, challenges, solutions, stack, links |
| **Experience** | Inline expandable work-history manager |
| **Skills** | Category-grouped, with proficiency levels |
| **Certifications** | Simple list manager |
| **Messages** | Inbox with read / archive / delete |
| **Settings** | Identity, social links, SEO metadata, availability toggle |

Changes go live on the public site within 5 minutes via ISR — no redeploy needed.

### Under the hood

- Next.js App Router, React Server Components throughout
- Server Actions for every CMS mutation — no separate REST/API layer
- Incremental Static Regeneration — pages are edge-cached, MongoDB is only hit on revalidation
- JWT auth in httpOnly cookies, with HTTPS-aware cookie flags (no `Secure` flag on plain HTTP, so local-network testing doesn't break)
- Docker-ready: multi-stage Alpine build, standalone output, non-root user
- SEO: dynamic sitemap, `robots.txt`, JSON-LD structured data, per-page Open Graph metadata

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + CSS custom properties |
| Database | MongoDB + Mongoose |
| Auth | JWT in httpOnly cookies |
| Animation | Framer Motion + CSS transitions |
| File storage | Vercel Blob |
| Deployment | Docker / Vercel |

## Quick start

**Prerequisites:** Node.js 20+, npm, and a MongoDB instance (local, or a free [Atlas](https://cloud.mongodb.com) cluster).

```bash
# 1. Clone and install
git clone https://github.com/sajjadulislam523/portfolio.git
cd portfolio
npm install

# 2. Configure environment
cp .env.local.example .env.local
# then fill in .env.local — see "Environment variables" below

# 3. Seed the database (creates the admin user + sample content)
npm run seed

# 4. Run it
npm run dev
```

| URL | What's there |
| --- | --- |
| `http://localhost:3000` | Public portfolio |
| `http://localhost:3000/admin/login` | Admin login |

## Environment variables

Copy `.env.local.example` to `.env.local` and fill these in:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | 64-char random hex. Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ADMIN_EMAIL` | Yes, for seeding | Admin login email — used once by `npm run seed` to create the account |
| `ADMIN_PASSWORD` | Yes, for seeding | Admin password — hashed by the seed script, change it after first login |
| `NEXT_PUBLIC_URL` | Yes | Full deployment URL, no trailing slash — used for sitemap, OG images, metadata |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob token, for resume/image uploads |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Optional | Set to `true` to enable page-view tracking to MongoDB |

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Set the environment variables from the table above in your Vercel project dashboard, then seed the production database once:

```bash
npm run seed
```

### Docker (self-hosted / local network)

```bash
# Point NEXT_PUBLIC_URL at your machine's address in .env.local, e.g.:
# NEXT_PUBLIC_URL=http://192.168.1.x:3000

cd docker
docker compose --env-file ../.env.local up --build -d

# Tail logs
docker logs portfolio_app -f
```

The app is then reachable from any device on the network at `http://192.168.1.x:3000`.

## Admin panel

Log in at `/admin/login` with the credentials from `.env.local`.

| Page | Purpose |
| --- | --- |
| `/admin/dashboard` | Stats overview + recent messages |
| `/admin/projects` | CRUD for portfolio projects |
| `/admin/experience` | Work history management |
| `/admin/skills` | Tech stack by category |
| `/admin/certifications` | Courses and certifications |
| `/admin/messages` | Contact form inbox |
| `/admin/settings` | Identity, SEO, social links |

## Command palette

Open it with **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) from any public page.

| Command | Action |
| --- | --- |
| Navigate → Home / Projects / Experience / Stack / Contact | Jump to that page |
| Download Resume | Opens the resume PDF |
| Switch to light/dark theme | Toggles the site theme |

## Project structure

```
src/
├── app/
│   ├── (public)/            # Public portfolio pages
│   │   ├── page.tsx         # Landing page
│   │   ├── projects/        # Projects list + detail
│   │   ├── experience/      # Career timeline
│   │   ├── stack/           # Tech ecosystem
│   │   └── contact/         # Contact form
│   ├── (admin)/admin/       # Admin CMS (JWT protected)
│   │   ├── login/
│   │   └── (protected)/
│   │       ├── dashboard/
│   │       ├── projects/
│   │       ├── experience/
│   │       ├── skills/
│   │       ├── certifications/
│   │       ├── messages/
│   │       └── settings/
│   ├── api/
│   │   ├── auth/            # Login / logout routes
│   │   └── upload/          # File uploads (resume, images) via Vercel Blob
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── admin/                 # Admin UI components
│   ├── sections/               # Public page sections (hero, experience, contact, ...)
│   ├── shared/                 # NavClient, CommandPalette, JsonLd
│   └── motion/                 # ScrollReveal, StaggerContainer, FadeIn
├── features/                   # Server Actions, grouped by domain
│   ├── projects/  experience/  skills/  certifications/  settings/  contact/  auth/
├── lib/
│   ├── db/                     # MongoDB connection + Mongoose models
│   ├── auth/                   # JWT sign/verify
│   └── validations/            # Zod schemas
└── types/                      # Shared TypeScript interfaces
```

## Local dev workflow

This repo uses a git alias to keep a `development` branch rebased cleanly onto `main`.

```bash
# One-time setup on a new machine
git config alias.syncdev "!git checkout main && git pull && git checkout development && git rebase main"
```

From then on, run `git syncdev` whenever you want to sync — it checks out `main`, pulls the latest, switches back to `development`, and rebases your work on top.

## License

MIT — feel free to use this as inspiration, but please don't deploy it as-is with someone else's content.

<div align="center">

Designed & built with ❤️ by **Sajjadul Islam**

[sajjadulislam.vercel.app](https://sajjadulislam.vercel.app) · [GitHub](https://github.com/sajjadislam523) · [LinkedIn](https://linkedin.com/in/sajjadislam523)

</div>
