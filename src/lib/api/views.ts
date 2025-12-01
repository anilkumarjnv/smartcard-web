export async function recordView({ slug, referrer, rate_seconds = 60 } : {slug?: string, referrer?: string, rate_seconds?: number}) {
    try {
      // Use v1 endpoint, fallback to legacy endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
      const url = `${baseUrl}/api/v1/views/record`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug, referrer, rate_seconds })
      });
      if (!res.ok) {
        const txt = await res.text();
        return { error: "fetch_failed", status: res.status, message: txt };
      }
      return res.json();
    } catch (err) {
      return { error: "fetch_failed", message: String(err) };
    }
  }
  