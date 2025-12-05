// src/app/api/analytics/[cardId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(
  req: NextRequest,
  context: { params: { cardId: string } | Promise<{ cardId: string }> }
) {
  const params = context.params instanceof Promise ? await context.params : context.params;
  const cardId = params?.cardId;

  if (!cardId) {
    return NextResponse.json({ error: "Card ID required" }, { status: 400 });
  }

  // Verify user authentication
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify card ownership and fetch real analytics
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      return NextResponse.json({ error: "No session token" }, { status: 401 });
    }

    // Verify card exists and user has access by fetching it
    // Backend will return 404 if card doesn't exist or doesn't belong to user
    const cardResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/cards/${cardId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!cardResponse.ok) {
      return NextResponse.json({ error: "Card not found or access denied" }, { status: 404 });
    }

    // Fetch real-time analytics from backend
    const analyticsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/${cardId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!analyticsResponse.ok) {
      const errorText = await analyticsResponse.text();
      return NextResponse.json(
        { error: `Failed to fetch analytics: ${errorText}` },
        { status: analyticsResponse.status }
      );
    }

    const analyticsData = await analyticsResponse.json();

    // Transform backend response to match frontend expectations
    // Backend returns: { totalViews, uniqueViews, daily: [{day, views}], referrers: [{referrer, count}], recent: [...] }
    const transformedData = {
      total_views: analyticsData.totalViews || 0,
      unique_views: analyticsData.uniqueViews || 0,
      daily: (analyticsData.daily || []).map((item: any) => ({
        day: item.day,
        count: item.views || item.count || 0  // Backend uses 'views', frontend expects 'count'
      })),
      referrers: analyticsData.referrers || [],
      recent: analyticsData.recent || []
    };

    return NextResponse.json(transformedData);

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
