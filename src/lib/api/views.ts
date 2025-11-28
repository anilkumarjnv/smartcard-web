export async function recordView({ slug, referrer, rate_seconds = 60 } : {slug?: string, referrer?: string, rate_seconds?: number}) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/record-view`;
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
  