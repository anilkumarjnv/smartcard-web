# ⚠️ QUICK FIX: Backend Server Not Running

## Problem
The dashboard shows "Failed to load dashboard" because the backend API server is not running on port 8080.

## Solution

### 1. Start the Backend Server

Open a **new terminal** and run:

```bash
cd /Users/ChaitanyaKrishna/Projects/smartcard/smartcard-backend
npm run dev
# or
yarn dev
```

The backend should start on **http://localhost:8080**

### 2. Verify Backend is Running

In another terminal, test:

```bash
curl http://localhost:8080/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

### 3. Check Environment Variables

Make sure you have `.env.local` in `smartcard-web/` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

And `.env` in `smartcard-backend/` with:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=8080
```

### 4. Refresh Dashboard

Once the backend is running:
1. Go to http://localhost:3000/dashboard
2. The page should load your cards!

---

## What's Happening

The frontend (Next.js on port 3000) is trying to fetch data from the backend (Express on port 8080):

```
Frontend (3000) ---API Call---> Backend (8080) ----> Supabase
```

When the backend isn't running, the API calls fail, showing "Failed to load dashboard".

---

## Complete Startup Sequence

**Terminal 1 - Backend:**
```bash
cd smartcard-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd smartcard-web
yarn dev
```

Both should be running simultaneously!

---

## Still Having Issues?

Check:
1. ✅ Backend running on port 8080
2. ✅ Frontend running on port 3000
3. ✅ Supabase credentials in .env files
4. ✅ No port conflicts

If you see CORS errors, make sure `FRONTEND_ORIGIN=http://localhost:3000` is in your backend `.env` file.

