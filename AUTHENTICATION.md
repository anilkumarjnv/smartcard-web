# Authentication System Documentation

## Overview

The SmartCard web application uses **Supabase Authentication** with **Magic Links** (passwordless email authentication). The system is built on Next.js 16 with App Router and uses Supabase SSR (Server-Side Rendering) for secure session management.

## Architecture

### Authentication Flow

```
User enters email
    ↓
Supabase sends magic link email
    ↓
User clicks link in email
    ↓
Supabase redirects to app with token
    ↓
Next.js middleware validates session
    ↓
User is authenticated
```

## Key Components

### 1. **Supabase Clients**

#### Browser Client (`src/lib/supabaseClient.ts`)
- Used in client components
- Uses `@supabase/ssr` `createBrowserClient`
- Handles browser-side authentication
- Manages session cookies automatically

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### Server Client (`src/lib/supabaseServer.ts`)
- Used in Server Components and Server Actions
- Uses `@supabase/ssr` `createServerClient`
- Reads/writes cookies via Next.js `cookies()` API
- Handles server-side session validation

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll, setAll } }
    );
}
```

### 2. **Authentication Utilities** (`src/lib/auth.ts`)

Core authentication functions:

#### `getCurrentUser()`
- Returns current authenticated user or `null`
- Checks session via Supabase
- Returns user object with `id`, `email`, `role`, and metadata

#### `signInWithEmail(email, redirectTo)`
- Sends magic link email via Supabase OTP
- Uses `supabase.auth.signInWithOtp()`
- No password required - passwordless authentication
- Returns error object if failed

#### `signOut()`
- Signs out current user
- Clears session and cookies
- Uses `supabase.auth.signOut()`

#### `isAuthenticated()`
- Quick check if user is logged in
- Returns boolean

#### `getAccessToken()`
- Gets JWT access token for API calls
- Used by `apiClient` to authenticate backend requests

### 3. **Next.js Middleware** (`src/middleware.ts`)

Runs on every request to protect routes:

**Protected Routes:**
- `/dashboard/*` - Requires authentication
- Redirects to `/login` if not authenticated

**Auth Routes:**
- `/login`, `/register` - Redirects to `/dashboard` if already logged in

**How it works:**
1. Creates Supabase server client with request cookies
2. Checks `supabase.auth.getUser()` to validate session
3. Redirects based on authentication state
4. Runs before page renders (edge middleware)

### 4. **Login Page** (`src/app/login/page.tsx`)

**Features:**
- Email-only login form (no password)
- Magic link authentication
- Success state after email sent
- Auto-redirect if already logged in
- Return URL support (`?returnTo=/dashboard/cards`)

**Flow:**
1. User enters email
2. Calls `signInWithEmail()`
3. Supabase sends email with magic link
4. User clicks link → redirected back to app
5. Middleware validates session
6. User redirected to dashboard

### 5. **Auth Guard Component** (`src/components/auth/AuthGuard.tsx`)

Client-side route protection:

```typescript
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

**Features:**
- Checks authentication on mount
- Shows loading spinner while checking
- Redirects to login if not authenticated
- Preserves return URL for redirect after login

### 6. **API Client Authentication** (`src/lib/apiClient.ts`)

Backend API calls include auth token:

```typescript
async function getAuthHeader(): Promise<Record<string, string>> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
        return {
            'Authorization': `Bearer ${session.access_token}`,
        };
    }
    return {};
}
```

- Automatically adds `Authorization: Bearer <token>` header
- Backend validates token via Supabase
- Used for protected API endpoints

## Authentication Flow Details

### 1. **Login Process**

```
User → /login page
    ↓
Enters email → submit
    ↓
signInWithEmail(email) called
    ↓
Supabase sends OTP email
    ↓
User receives email with link
    ↓
Clicks link → redirects to app
    ↓
Middleware validates token
    ↓
Session created → cookies set
    ↓
Redirected to /dashboard
```

### 2. **Session Management**

- **Cookies**: Supabase stores session in HTTP-only cookies
- **Automatic Refresh**: Supabase handles token refresh
- **SSR Support**: Works in both client and server components
- **Cross-tab Sync**: Session syncs across browser tabs

### 3. **Route Protection**

**Server-side (Middleware):**
- Runs before page load
- Fast redirects (no flash of content)
- Protects `/dashboard/*` routes

**Client-side (AuthGuard):**
- Component-level protection
- Shows loading states
- Useful for dynamic content

### 4. **Backend Authentication**

When calling Express backend APIs:

1. Frontend gets access token from Supabase session
2. Adds `Authorization: Bearer <token>` header
3. Backend validates token with Supabase
4. Backend extracts user info from token
5. Request proceeds with authenticated user

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
- Anon key is restricted by Supabase RLS policies
- Never expose service role key in frontend

## Protected Routes

### Dashboard Routes (Auto-protected by middleware)
- `/dashboard` - Main dashboard
- `/dashboard/cards` - Card management
- `/dashboard/card/[cardId]` - Card editor
- `/dashboard/leads` - Leads management
- `/dashboard/analytics` - Analytics

### Public Routes
- `/` - Homepage
- `/[slug]` - Public card view (no auth required)
- `/login` - Login page (redirects if logged in)

## Usage Examples

### Check if user is authenticated:

```typescript
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

// Get user object
const user = await getCurrentUser();
if (user) {
  console.log('Logged in as:', user.email);
}

// Quick check
const isAuth = await isAuthenticated();
```

### Protect a component:

```typescript
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

### Sign out:

```typescript
import { signOut } from '@/lib/auth';

async function handleLogout() {
  await signOut();
  window.location.href = '/';
}
```

### Make authenticated API call:

```typescript
import { apiClient } from '@/lib/apiClient';

// Automatically includes auth token
const cards = await apiClient.get('/api/v1/cards/user');
```

## Security Features

1. **Passwordless Authentication**
   - No passwords to store or hash
   - Magic links expire after use
   - Reduces attack surface

2. **JWT Tokens**
   - Short-lived access tokens
   - Automatic refresh
   - Stored in HTTP-only cookies

3. **RLS (Row Level Security)**
   - Database-level security
   - Users can only access their own data
   - Enforced by Supabase

4. **Middleware Protection**
   - Server-side route protection
   - No client-side bypass possible
   - Fast redirects

5. **CORS Protection**
   - Backend validates origin
   - Only allows frontend domain

## Backend Integration

The Express backend validates Supabase tokens:

1. Frontend sends `Authorization: Bearer <token>` header
2. Backend extracts token from header
3. Backend calls Supabase to verify token
4. Backend gets user info from token
5. Request proceeds with `req.user` attached

See `smartcard-backend/server/src/middleware/auth.middleware.ts` for backend auth logic.

## Common Patterns

### Server Component Auth Check:

```typescript
import { createClient } from '@/lib/supabaseServer';

export default async function ServerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return <div>Protected content</div>;
}
```

### Client Component Auth Check:

```typescript
'use client';
import { getCurrentUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function ClientPage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);
  
  if (!user) return <div>Loading...</div>;
  return <div>Hello {user.email}</div>;
}
```

## Troubleshooting

### "Session not found" errors
- Check cookies are enabled
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check Supabase project is active

### Redirect loops
- Ensure middleware matcher excludes static files
- Check redirect URLs are absolute
- Verify auth state in Supabase dashboard

### Token validation fails
- Check token hasn't expired
- Verify Supabase project settings
- Check backend can reach Supabase

## Summary

The authentication system uses:
- **Supabase Auth** for user management
- **Magic Links** for passwordless login
- **Next.js Middleware** for route protection
- **JWT Tokens** for API authentication
- **Cookie-based sessions** for persistence
- **SSR support** for server components

This provides a secure, scalable authentication system without managing passwords or tokens manually.

