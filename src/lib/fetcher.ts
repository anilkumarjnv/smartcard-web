// src/lib/fetcher.ts
export async function fetcher(url: string) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      // credentials: "include" // if you need cookies/auth
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || `HTTP ${res.status}`);
    }
    return res.json();
  }
  