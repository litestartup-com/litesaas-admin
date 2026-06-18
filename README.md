# Lite SaaS Admin

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)](https://tailwindcss.com/)

A modern, production-ready SaaS admin dashboard built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI. Ships with a complete feature set — dashboard, user management, billing, AI chat, notifications, i18n, authentication, and dark mode — so you can focus on your product, not boilerplate.

**Built and maintained by [Litestartup](https://www.litestartup.com)** — the all-in-one platform for startups.

> **Looking for more?** Check out [Litestartup](https://www.litestartup.com) for email marketing, transactional APIs, live chat, AI agents, and growth tools designed for startups.

## Features

- **Analytics Dashboard** — Revenue stats, visitor charts (7d/30d/3mo), recent activity, real-time refresh
- **User Management** — Search, pagination, sorting, user details drawer, ban/unban with reason & expiration
- **Billing & Credits** — Subscription plans, order history, monthly/yearly pricing toggle, Stripe checkout
- **AI Chat** — Multi-provider interface (GPT-4o, GPT-4, Claude 3, Gemini Pro), conversation history
- **Notifications** — Type/status filters, mark as read, pagination, header dropdown preview
- **Profile** — Email management, authentication method management, third-party auth connect/disconnect
- **Internationalization** — English & Chinese (简体中文), Zustand-powered with persistent preference
- **Authentication** — JWT-based auth via LiteStartup backend, auto refresh, route protection (AuthGuard)
- **Responsive Design** — Mobile-friendly with collapsible sidebar
- **Dark Mode** — System preference detection, manual toggle, persistent theme via next-themes

## Build with AI Coding Agents

Use the **litestartup-admin** [Agent Skill](https://github.com/litestartup-com/litestartup-skills) to let AI coding agents scaffold and extend your SaaS app in minutes — no manual API wiring needed.

### Install the Skill

```bash
npx skills add litestartup-com/litestartup-skills --skill litestartup-admin
```

This adds skill context files to your workspace. Any compatible coding agent will read and follow them automatically.

### Supported Agents

| Agent | How it works |
|-------|-------------|
| **OpenAI Codex** | Reads `AGENTS.md` |
| **Claude Code** | Reads `CLAUDE.md` |
| **Cursor** | Reads `.cursor/rules/litestartup.mdc` |
| **Windsurf (Cascade)** | Reads `.windsurfrules` |

### What Can the Agent Do?

Describe what you need in natural language:

- **"init saas"** → Clone boilerplate, install deps, configure API key, start dev server
- **"add welcome email"** → Wire up transactional email via LS Email API
- **"add file upload"** → Integrate LS Storage (S3-backed)
- **"add AI chat"** → Connect to LS LLM Router (GPT-4o, Claude, Gemini)
- **"add contact management"** → Hook into LS CRM/Contacts API

### Why is a LiteStartup API Key Required?

LiteStartup is a platform that provides ready-to-use services — **website hosting, blog, docs, changelog, email, user auth, file storage, AI, and more**. Combined with this free open-source SaaS admin boilerplate, it dramatically reduces the time and cost of building a SaaS product.

**One API key connects your frontend to all of these platform services:**

| Platform Service | What it saves you |
|---|---|
| User Auth (register/login/OAuth/verification code) | Building auth from scratch + session management |
| Transactional & Marketing Email | SMTP infrastructure + deliverability management |
| File Storage (S3-backed) | Object storage setup + signed URL logic |
| AI Capabilities (LLM Router, TTS, image gen) | Integrating multiple AI providers individually |
| Contact CRM & Newsletter | Database schema + CRUD endpoints |
| Website / Blog / Docs / Changelog | Separate CMS deployment |

**The Free plan gives you enough to validate your MVP** — start building today, scale when you're ready.

> Get your free API key at [app.litestartup.com/settings/api-keys](https://app.litestartup.com/settings/api-keys) — enable the `auth` scope to start.

## Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3, Shadcn UI, Radix UI primitives |
| **State** | Zustand |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **i18n** | Custom solution with Zustand + JSON translations |

## Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A running [LiteStartup](https://www.litestartup.com) instance with an API Key (requires `auth` scope)

### Setup

```bash
# Clone the repository
git clone https://github.com/litestartup-com/litesaas-admin.git
cd litesaas-admin

# Install dependencies
npm install

# Copy environment variables and fill in your LS API Key
cp .env.example .env.local
# Edit .env.local → set LS_API_URL and LS_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of this app (e.g. `http://localhost:3000`) |
| `LS_API_URL` | Yes | Base URL of your LiteStartup instance |
| `LS_API_KEY` | Yes | LS API Key with `auth` scope |

> **Note:** Authentication, AI chat, and profile are powered by the LS backend. Make sure your API Key has the `auth` scope enabled.

## Project Structure

```
litesaas-admin/
├── app/                          # Next.js App Router
│   ├── admin/users/              # User management
│   ├── ai-chat/                  # AI chat interface
│   ├── api/                      # API routes (proxy to LS backend)
│   │   ├── ai/                   # AI chat APIs
│   │   ├── auth/                 # Authentication APIs
│   │   ├── billing/              # Billing APIs
│   │   ├── credits/              # Credits APIs
│   │   ├── dashboard/            # Dashboard APIs
│   │   ├── notifications/        # Notification APIs
│   │   ├── profile/              # Profile APIs
│   │   ├── stripe/               # Stripe integration (mock)
│   │   └── users/                # User management APIs
│   ├── billing/                  # Billing page
│   ├── credits/                  # Pricing page
│   ├── dashboard/                # Dashboard page
│   ├── login/                    # Login page
│   ├── notifications/            # Notifications page
│   ├── profile/                  # Profile page
│   ├── signup/                   # Signup page
│   ├── verify-email/             # Email verification
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── auth/                     # Auth guard
│   ├── dashboard/                # Stats, charts, activity
│   ├── layout/                   # Header, sidebar, language switcher
│   ├── magic/                    # Animated gradient text
│   └── ui/                       # Shadcn UI components
├── lib/
│   ├── i18n/                     # Translations (en.json, zh.json)
│   ├── api.ts                    # API client utilities
│   ├── api-auth.ts               # Server-side auth middleware
│   ├── api-client.ts             # Token-aware fetch client
│   ├── auth.ts                   # Token management
│   ├── fetch-with-auth.ts        # Authenticated fetch helper
│   └── utils.ts                  # cn() helper and utilities
├── store/                        # Zustand stores (i18n, nav, ui, user)
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml            # Docker Compose config
└── .env.example                  # Environment variable template
```

## Pages

| Route | Description |
|---|---|
| `/dashboard` | Revenue stats, visitor chart, recent activity, real-time refresh |
| `/admin/users` | User table with search, pagination, sorting, details drawer, ban/unban |
| `/billing` | Subscription plan, order history, upgrade CTA |
| `/credits` | Pricing plans (Free/Pro/Enterprise), monthly/yearly toggle, Stripe checkout |
| `/ai-chat` | Multi-provider AI chat with provider switching and conversation history |
| `/notifications` | Notification list with type/status filters, mark as read, pagination |
| `/profile` | Email and auth method management, third-party provider connect/disconnect |
| `/login` | Email/password or verification code login |
| `/signup` | User registration |
| `/verify-email` | Code-based email verification |

## Usage Guide

### Internationalization

```typescript
import { useTranslation } from "@/lib/i18n"

export function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('nav.dashboard')}</h1>
}
```

Add translations in `lib/i18n/translations/en.json` and `zh.json`. Language preference persists in localStorage.

### Authentication

```typescript
import { setAuthToken, getAuthToken, isAuthenticated, clearAuthToken } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

// Check auth status
if (isAuthenticated()) { /* ... */ }

// Authenticated API call (auto-includes token, handles 401 redirects)
const response = await fetchWithAuth("/api/dashboard/stats")
```

Route protection via `AuthGuard`:
- Redirects unauthenticated users to `/login`
- Public routes: `/login`, `/signup`, `/verify-email`
- Tokens expire after 1 hour with automatic cleanup

### State Management

```typescript
import { create } from 'zustand'

interface MyStore { count: number; increment: () => void }

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))
```

Existing stores: `use-i18n.ts`, `use-navigation.ts`, `use-ui.ts`, `use-user.ts`.

### Forms

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  // ...
}
```

### Adding UI Components

```bash
npx shadcn-ui@latest add [component-name]
```

## API Routes

All routes in `app/api/` are mock implementations. Replace them with your real backend when ready.

| Endpoint | Auth | Description |
|---|---|---|
| `/api/auth/*` | No | Login, signup, verify, password reset |
| `/api/dashboard/*` | Yes | Dashboard stats and chart data |
| `/api/users/*` | Yes | User CRUD and ban management |
| `/api/billing/*` | Yes | Subscription and order data |
| `/api/credits/*` | Yes | Pricing plans |
| `/api/notifications/*` | Yes | Notification list and actions |
| `/api/profile/*` | Yes | Profile management |
| `/api/ai/*` | Yes | AI chat completions |
| `/api/stripe/*` | Yes | Stripe checkout (mock) |

Server-side auth middleware:
```typescript
import { authenticateRequest } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)
  if (!auth.authenticated) return auth.response!
  // ...
}
```

## Deployment

### Docker (Recommended)

```bash
# docker-compose
docker-compose up -d --build

# Or plain Docker
docker build -t litesaas-admin .
docker run -d -p 3000:3000 --name litesaas litesaas-admin
```

The repository includes `Dockerfile`, `.dockerignore`, and `docker-compose.yml`. Requires `output: 'standalone'` in `next.config.js` (already configured).

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

Add `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Self-Hosted (PM2 + Nginx)

```bash
npm run build
pm2 start npm --name "litesaas-admin" -- start
```

See the full [deployment guide](#production-checklist) below for Nginx config and SSL setup.

## Production Checklist

Before going to production, replace mock implementations with real services:

- [ ] Replace mock API routes with real backend / database (Prisma, Drizzle, etc.)
- [ ] Set up real authentication (NextAuth.js, Clerk, Auth0, or custom JWT)
- [ ] Configure Stripe with production keys
- [ ] Set environment variables (see `.env.example`)
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics, Plausible)
- [ ] Set up monitoring and uptime alerts
- [ ] Enable HTTPS and security headers
- [ ] Test production build locally with `npm run build && npm start`

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

See `.env.example` for all available variables. **Never commit `.env.local` to version control.**

### Security Best Practices

1. Never expose secrets in client-side code
2. Always use HTTPS in production
3. Configure CORS policies
4. Implement rate limiting for API routes
5. Validate all inputs with Zod
6. Use parameterized queries (Prisma, Drizzle)
7. Sanitize user-generated content
8. Implement CSRF tokens for forms
9. Configure Content Security Policy headers
10. Regularly update dependencies

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
npx tsc --noEmit  # Type check
```

## About Litestartup

**[Litestartup](https://www.litestartup.com)** is the all-in-one platform built for startups — email marketing, transactional email API, live chat & help desk, AI agents, and growth tools. Lite SaaS Admin is one of our open-source projects designed to help developers ship faster.

Explore more from Litestartup:
- [Litestartup Platform](https://www.litestartup.com) — All-in-one startup toolkit
- [Documentation](https://www.litestartup.com/docs) — Guides and API references
- [Blog](https://www.litestartup.com/blog) — Engineering and product insights

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by [Litestartup](https://www.litestartup.com)