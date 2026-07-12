<div align="center">

# Sajjadul Islam — Portfolio Platform

**A production-grade personal portfolio platform built with Next.js 15, TypeScript, TailwindCSS, and MongoDB.**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

[Live Site](https://sajjadulislam.vercel.app) · [Admin Panel](https://sajjadulislam.vercel.app/admin) · [Report a Bug](https://github.com/sajjadulislam523/portfolio/issues)

</div>

---

## Overview

This is not a template. It is a fully custom, production-grade portfolio platform engineered from scratch — featuring a public-facing portfolio site, a password-protected admin CMS, a 5-theme design system, and a command palette.

Built to communicate: **"I can design, build, deploy, and maintain production-grade web applications."**

Inspired by the design language of Linear, Vercel, Stripe, and Raycast.

---

## Screenshots

| Public Site                  | Admin Dashboard              | Theme Switcher    |
| ---------------------------- | ---------------------------- | ----------------- |
| Hero with terminal code card | Live stats and message inbox | 5 built-in themes |

---

## Features

### Public Portfolio

- **Editorial hero** — terminal code card showcasing the tech stack, availability badge, quick navigation
- **Projects** — product-style presentation with overview, challenges, solutions, and tech stack per project
- **Experience** — interactive CSS accordion timeline with hover accent effects
- **Stack** — categorised technology ecosystem with proficiency levels (Expert / Proficient / Familiar)
- **Contact** — server-side form saving directly to MongoDB inbox
- **Command palette** — ⌘K navigation across all sections and theme switching
- **5-theme system** — Midnight, Ocean, Sunset, Matrix, Aurora — server-side injected, no flash

### Admin CMS (`/admin`)

- Password-protected with JWT in httpOnly cookies
- **Projects** — full CRUD with slug, tagline, overview, challenges, solutions, tech stack, links
- **Experience** — inline expandable manager
- **Skills** — category-grouped pill manager with proficiency levels
- **Certifications** — list manager
- **Messages** — contact form inbox with read/archive/delete
- **Theme editor** — visual picker with live mini preview
- **Settings** — identity, social links, SEO metadata, availability toggle
- All changes reflect on the public site within 5 minutes via ISR

### Technical Highlights

- **Next.js 15 App Router** with React Server Components throughout
- **Server Actions** for all mutations — no separate API layer for CMS operations
- **ISR (Incremental Static Regeneration)** — pages cached at Vercel's edge, MongoDB only hit on revalidation
- **JWT authentication** with HTTPS-aware cookie flags (no `Secure` on HTTP, preventing local network issues)
- **5-theme token system** — CSS custom properties injected server-side, zero flash of unstyled content
- **Docker-ready** — multi-stage Alpine build, standalone output, non-root user
- **SEO** — dynamic sitemap, robots.txt, JSON-LD structured data, per-page Open Graph metadata

---

## Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Framework       | Next.js 15 (App Router)             |
| Language        | TypeScript                          |
| Styling         | TailwindCSS + CSS custom properties |
| Database        | MongoDB + Mongoose                  |
| Authentication  | JWT in httpOnly cookies             |
| Animation       | Framer Motion + CSS transitions     |
| Deployment      | Docker / Vercel                     |
| Package manager | npm                                 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com) — free tier works)
- npm

### 1. Clone and install

```bash
git clone https://github.com/sajjadulislam523/portfolio.git
cd portfolio
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Seed the database

Populates MongoDB with your resume data and creates the admin user:

```bash
npm run seed
```

### 4. Start development

```bash
npm run dev
```

| URL                                 | Description      |
| ----------------------------------- | ---------------- |
| `http://localhost:3000`             | Public portfolio |
| `http://localhost:3000/admin/login` | Admin panel      |

---

## Deployment

### Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set these environment variables in your Vercel dashboard:

| Variable          | Value                           |
| ----------------- | ------------------------------- |
| `MONGODB_URI`     | MongoDB Atlas connection string |
| `JWT_SECRET`      | 64-char random hex string       |
| `ADMIN_EMAIL`     | Your admin email                |
| `ADMIN_PASSWORD`  | Your admin password             |
| `NEXT_PUBLIC_URL` | `https://yourdomain.vercel.app` |

Then run the seed script once to populate your production database:

```bash
npm run seed
```

### Docker (local network / VPS)

```bash
# Set your machine's IP in .env.local
NEXT_PUBLIC_URL=http://192.168.1.x:3000

# Build and run
cd docker
docker compose --env-file ../.env.local up --build -d

# Check logs
docker logs portfolio_app -f
```

Access from any device on your network at `http://192.168.1.x:3000`.

---

## Admin Panel

Log in at `/admin/login` with the credentials from your `.env.local`.

| Page                    | Purpose                            |
| ----------------------- | ---------------------------------- |
| `/admin/dashboard`      | Stats overview and recent messages |
| `/admin/projects`       | CRUD for portfolio projects        |
| `/admin/experience`     | Work history management            |
| `/admin/skills`         | Tech stack by category             |
| `/admin/certifications` | Courses and certifications         |
| `/admin/themes`         | Switch the active theme            |
| `/admin/settings`       | Identity, SEO, social links        |
| `/admin/messages`       | Contact form inbox                 |

---

## Theme System

Five built-in themes, all token-based. Switch from `/admin/themes` or press ⌘K and type "theme".

| Theme    | Accent           | Personality              |
| -------- | ---------------- | ------------------------ |
| Midnight | Violet `#7C6AF7` | Default — clean, premium |
| Ocean    | Sky `#38BDF8`    | Cool, professional       |
| Sunset   | Rose `#FB7185`   | Warm, creative           |
| Matrix   | Green `#22C55E`  | Terminal, bold           |
| Aurora   | Purple `#A78BFA` | Ethereal, distinctive    |

Themes are injected as CSS custom properties server-side — zero flash of unstyled content on any device.

---

## Command Palette

Press **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) on any public page.

| Command               | Action                |
| --------------------- | --------------------- |
| Navigate → Projects   | Go to `/projects`     |
| Navigate → Experience | Go to `/experience`   |
| Navigate → Stack      | Go to `/stack`        |
| Navigate → Contact    | Go to `/contact`      |
| Download Resume       | Opens resume PDF      |
| [Theme] theme         | Switches active theme |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public portfolio pages
│   │   ├── page.tsx       # Landing page
│   │   ├── projects/      # Projects list + detail
│   │   ├── experience/    # Career timeline
│   │   ├── stack/         # Tech ecosystem
│   │   └── contact/       # Contact form
│   ├── (admin)/admin/     # Admin CMS (JWT protected)
│   │   ├── login/         # Auth page
│   │   ├── dashboard/     # Overview
│   │   ├── projects/      # Project CRUD
│   │   ├── experience/    # Experience manager
│   │   ├── skills/        # Skills manager
│   │   ├── certifications/
│   │   ├── messages/      # Contact inbox
│   │   ├── themes/        # Theme editor
│   │   └── settings/      # Site settings
│   ├── api/auth/          # Login / logout routes
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts
├── components/
│   ├── admin/             # Admin UI components
│   ├── sections/          # Public page sections
│   ├── shared/            # NavClient, CommandPalette, JsonLd
│   └── motion/            # ScrollReveal, FadeIn
├── features/              # Server Actions per domain
│   ├── projects/
│   ├── experience/
│   ├── skills/
│   ├── certifications/
│   ├── settings/
│   ├── contact/
│   └── auth/
├── lib/
│   ├── db/                # MongoDB connection + all Mongoose models
│   ├── themes/            # Token definitions + CSS injection utils
│   ├── auth/              # JWT sign/verify
│   └── validations/       # Zod schemas
└── types/                 # Shared TypeScript interfaces
```

---

## Environment Variables

| Variable                        | Required  | Description                            |
| ------------------------------- | --------- | -------------------------------------- |
| `MONGODB_URI`                   | ✅        | MongoDB connection string              |
| `JWT_SECRET`                    | ✅        | 64-char hex string for JWT signing     |
| `ADMIN_EMAIL`                   | ✅ (seed) | Admin login email                      |
| `ADMIN_PASSWORD`                | ✅ (seed) | Admin password — hashed by seed script |
| `NEXT_PUBLIC_URL`               | ✅        | Full deployment URL, no trailing slash |
| `BLOB_READ_WRITE_TOKEN`         | ✅        | Vercel Blob for resume/image uploads   |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | ⚪        | Enable page view tracking              |

---

## License

MIT — feel free to use this as inspiration, but please don't deploy it as-is with someone else's content.

---

<div align="center">

Designed & built with ❤️ by **Sajjadul Islam**

[sajjadulislam.vercel.app](https://sajjadulislam.vercel.app) · [GitHub](https://github.com/sajjadislam523) · [LinkedIn](https://linkedin.com/in/sajjadislam523)

</div>
