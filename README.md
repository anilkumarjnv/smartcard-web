# SmartCard Frontend

Production-ready Next.js frontend for SmartCard, built with TypeScript, Tailwind CSS, and Supabase.

## 🚀 Quick Start

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Environment Setup:**
    Copy `.env.example` to `.env.local` and fill in your keys:
    ```bash
    cp .env.example .env.local
    ```
    
    Required variables:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
    - `NEXT_PUBLIC_API_BASE`: Backend API URL (default: `http://localhost:8080`)

3.  **Run Development Server:**
    ```bash
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
src/
├── app/                 # App Router pages
│   ├── [slug]/          # Public card page (Server Component)
│   ├── dashboard/       # Protected dashboard pages
│   │   ├── card/        # Card details & analytics
│   │   ├── cards/       # Card management
│   │   └── leads/       # Leads management
│   └── login/           # Auth pages
├── components/          # Reusable UI components
│   ├── analytics/       # Charts & data viz
│   ├── ui/              # Base UI (Button, Card, Input...)
│   └── ...              # Feature components (Nav, AuthGuard)
├── lib/                 # Core utilities
│   ├── api/             # API types & client
│   ├── auth.ts          # Auth helpers
│   └── validators.ts    # Zod schemas
└── utils/               # Helper functions
```

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Data Fetching:** SWR + Native Fetch
- **Auth:** Supabase Auth (SSR + Client)
- **Charts:** Recharts
- **Validation:** Zod

## 🔒 Security

- **Authentication:** Protected routes via `AuthGuard` and server-side checks.
- **API Security:** Service role keys are NEVER exposed. All client requests use the anonymous key or backend proxy.
- **Validation:** All inputs validated with Zod schemas matching backend.

## 📱 Features

- **Public Card View:** SEO-optimized, fast loading, view tracking.
- **Dashboard:** Manage cards, view analytics, track leads.
- **Analytics:** Interactive charts for views, device breakdown, and referrers.
- **Card Editor:** Real-time editing with live preview link.
- **Responsive:** Mobile-first design for all pages.
