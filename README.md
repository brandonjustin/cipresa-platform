# CIPRESA Consulting Platform v2.0

Next-generation Agricultural E-learning & Agri-commerce Platform

Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Supabase, and TanStack Query.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Lint
npm run lint
```

## Architecture

```
cipresa-platform/
├── src/
│   ├── middleware.ts            # Session refresh + /dashboard, /admin route protection
│   ├── app/                     # Next.js 14 App Router
│   │   ├── (marketing)/         # Public pages (courses, marketplace, encyclopedia,
│   │   │                        # blog, paths, about, services, contact, ...)
│   │   ├── (dashboard)/dashboard/  # User dashboard (+ orders)
│   │   ├── (admin)/admin/       # Admin CMS (courses, products, orders, blog,
│   │   │                        # encyclopedia, users)
│   │   ├── auth/                # login, register, forgot/reset-password, callback
│   │   ├── api/payments/nokash/ # webhook + status-poll route handlers
│   │   ├── sitemap.ts, robots.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                  # Reusable UI primitives
│   │   ├── layout/               # Nav, Footer, Search, Cart
│   │   ├── admin/                # Admin shell + entity forms
│   │   ├── course/, marketplace/, blog/, encyclopedia/  # Server/Client page pairs
│   │   ├── auth/                 # AuthProvider (hydrates session into the store)
│   │   └── seo/                  # JSON-LD helper
│   ├── lib/
│   │   ├── supabase/             # Browser/server/admin/middleware Supabase clients
│   │   ├── data/                  # Server-side read queries (one file per domain)
│   │   ├── actions/                # Server actions incl. actions/admin/ for CMS mutations
│   │   ├── payments/                # Provider-agnostic interface + Nokash adapter
│   │   ├── email/                    # Resend client + templates
│   │   ├── auth/                      # requireAdmin(), client-side auth actions
│   │   ├── store/                      # Zustand: cart, ui, progress (auth is a session cache)
│   │   └── utils/                      # formatting helpers + legacy mock data
│   └── types/                    # Shared TypeScript types
├── supabase/
│   ├── config.toml               # Local Supabase CLI config
│   ├── migrations/               # Versioned schema migrations (source of truth)
│   └── seed.sql                  # Local dev seed data
├── e2e/                          # Playwright specs
└── .github/workflows/ci.yml      # typecheck + test + build on push/PR
```

## Environment Variables

Copy `.env.local` and fill in your values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (new-style, replaces legacy anon key) |
| `SUPABASE_SECRET_KEY` | Supabase secret key (new-style, replaces legacy service role key — server-only) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for metadata, emails, webhooks) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (course video/image hosting) |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret — server-only, never prefix with `NEXT_PUBLIC_` |
| `NOKASH_I_SPACE_KEY` | Nokash integrator key (primary payment processor, server-only) |
| `NOKASH_APP_SPACE_KEY` | Nokash application key (server-only) |
| `NOKASH_API_URL` | Nokash API base URL (`https://api.nokash.app`) |
| `RESEND_API_KEY` | Resend transactional email API key |
| `RESEND_FROM_EMAIL` | Verified sender address for transactional emails |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking (optional) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |

## Database Setup

**Local development** (requires Docker + the [Supabase CLI](https://supabase.com/docs/guides/cli)):
```bash
supabase start        # spins up local Postgres/Auth/Storage
supabase db reset      # applies supabase/migrations/*.sql + supabase/seed.sql
```
Seeded accounts (password `password123` for all): `admin@cipresa.local` (admin), `evariste@cipresa.local` / `marie@cipresa.local` (instructors), `student@cipresa.local` (student, pre-enrolled in two free courses).

**Hosted project**:
1. Create a Supabase project
2. `supabase link --project-ref <ref>` then `supabase db push` to apply everything in `supabase/migrations/` in order
3. RLS is enabled and policed table-by-table inside the migrations themselves — nothing to configure manually
4. Set up Authentication providers (Email is required; add Google/etc. as needed) in the Supabase dashboard

## Features

### Learning Platform (LMS)
- Course catalog with categories & filters
- Course detail with curriculum, instructor info
- Video lesson player with preview support
- Student progress tracking
- Learning Paths (curated multi-course tracks)
- Reviews & ratings

### Marketplace
- Product catalog with categories
- Product variants (e.g., seed varieties)
- Shopping cart with quantity management
- Order management
- Stock tracking

### Plant Encyclopedia
- Searchable plant database
- Climate, soil, water requirements
- Growth & harvest information
- Region compatibility
- Export potential indicators

### Company Showcase
- About, mission, vision
- Team profiles
- Blog with articles
- Events & webinars
- Contact with form

### Smart Features
- AI agricultural chatbot assistant
- Smart search across courses, products, plants
- Personalized recommendations
- Dark/light mode
- PWA offline support

### Admin Dashboard
- Revenue & user analytics
- Course management
- Product management
- User management
- Order tracking
- Monthly revenue charts

### Authentication
- Email/password login
- User registration
- Password reset
- Remember me

## Brand Identity

- **Primary Color**: CIPRESA Blue (#1f63b5)
- **Secondary**: Earth tones, African gold accents
- **Typography**: Inter (sans-serif)
- **Language**: French (African agricultural focus)
- **Style**: Premium, modern, nature-inspired, glassmorphism

## Performance Optimizations

- Image optimization with Next.js built-in
- Lazy loading components
- Service worker for offline caching
- Responsive images with AVIF/WebP
- Tailwind CSS purging unused styles
- Route-based code splitting
- Optimized video delivery

## Testing

```bash
npm test          # Vitest — pure logic (payment adapter, formatting, etc.)
npm run test:e2e  # Playwright — see e2e/
```

`e2e/smoke.spec.ts` needs no backend and always runs. Everything else in `e2e/` is gated behind a live Supabase project (checks `NEXT_PUBLIC_SUPABASE_URL` for a real `supabase.co` host) and expects `supabase/seed.sql` to be applied — they `test.skip` themselves otherwise rather than failing. CI (`.github/workflows/ci.yml`) runs typecheck + Vitest + build on every push/PR against placeholder env vars; it does not run the Playwright suite, since that needs a real project.

## Deployment

Deploy target is **Vercel** — it's zero-config for this Next.js/PWA setup and everything else (Supabase, Cloudinary, Nokash, Resend, Sentry) is reachable over plain HTTPS from Vercel's serverless functions.

```bash
npm i -g vercel
vercel
```

**Before going live, in order:**
1. Create the Supabase project, run `supabase link --project-ref <ref> && supabase db push` (see Database Setup above), and set an initial admin: sign up normally, then in the Supabase SQL editor run `update profiles set role = 'admin' where email = '...';`.
2. Create a Cloudinary account for course video/image hosting.
3. Create a Nokash merchant account (nokash.app) and get sandbox keys first — test a full payin before switching to production keys. Confirm with Nokash support whether their API requires a static outbound IP allowlist; if so, front the `src/lib/payments/nokash.ts` calls through a small proxy (e.g. a Fly.io/Render service) rather than moving the whole app off Vercel.
4. Create a Resend account and verify a sending domain for `RESEND_FROM_EMAIL`.
5. (Optional) Create a Sentry project for `NEXT_PUBLIC_SENTRY_DSN`, and a Google Analytics property for `NEXT_PUBLIC_GA_ID`.
6. Set every variable from the Environment Variables table above in the Vercel project settings (they're only ever read from `.env.local` locally — nothing is hardcoded).
7. In the Nokash dashboard, point the callback/webhook configuration at `https://<your-domain>/api/payments/nokash/webhook` (production keys only — sandbox never calls back, the app polls instead; see `src/app/api/payments/nokash/status/route.ts`).
8. Point Supabase Auth's site URL / redirect URLs at your production domain so email confirmation and password-reset links resolve correctly.
