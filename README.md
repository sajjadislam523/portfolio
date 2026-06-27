# Portfolio Platform

A production-grade personal portfolio platform built with Next.js 15, TypeScript, TailwindCSS, and MongoDB.

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.local.example .env.local
# Fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_URL

# 3. Seed database
npm run seed

# 4. Run
npm run dev
```

- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Command Palette

Press **⌘K** on any public page — navigate, switch themes, download resume.

## Themes

Midnight · Ocean · Sunset · Matrix · Aurora — switch from `/admin/themes` or ⌘K.

## Deployment

**Vercel:** `vercel --prod` + MongoDB Atlas + set env vars in dashboard.

**Docker:** `cd docker && docker compose --env-file ../.env.local up -d`

## Environment Variables

| Variable                | Required | Description                                                                                               |
| ----------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`           | ✅       | MongoDB connection string                                                                                 |
| `JWT_SECRET`            | ✅       | 64-char random hex (generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `ADMIN_EMAIL`           | ✅       | Admin login email                                                                                         |
| `ADMIN_PASSWORD`        | ✅       | Admin password (hashed at seed time)                                                                      |
| `NEXT_PUBLIC_URL`       | ✅       | Full production URL, no trailing slash                                                                    |
| `BLOB_READ_WRITE_TOKEN` | ⚪       | Vercel Blob for file uploads                                                                              |
