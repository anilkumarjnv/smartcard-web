// src/app/api/analytics/[cardId]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> | { cardId: string } }
) {
  try {
    // Unwrap params if it's a Promise
    const resolvedParams = params instanceof Promise ? await params : params;
    const { cardId } = resolvedParams;

    if (!cardId) {
      return NextResponse.json({ error: "cardId required" }, { status: 400 });
    }

    // Backend URL - use environment variable or default to localhost
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${BACKEND_URL}/api/analytics/${encodeURIComponent(cardId)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      // Add cache control for better performance
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Backend request failed", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Analytics API route error:", message);
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}

