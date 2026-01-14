// src/components/CardAnalyticsClient.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import TimelineChart from "./TimelineChart";
import RecentViews from "./RecentViews";
import { SummaryCards } from "@/components/analytics/SummaryCards";
import { Card, CardBody } from "@/components/ui/Card";
import { useSubscription } from '@/hooks/useSubscription';
import { Lock } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";

type Analytics = {
  total_views: number;
  unique_views: number;
  daily: { day: string; count: number }[];
  referrers: { referrer: string | null; count: number }[];
  recent: Array<{ id: string; referrer: string | null; viewed_at: string; user_agent: string; city?: string | null; country?: string | null }>;
};

export default function CardAnalyticsClient({ cardId }: { cardId: string }) {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const { isPro } = useSubscription();

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/analytics/${cardId}`);
      if (!res.ok) {
        // If 403, it might mean we're blocked? But our route sends 200 with partial data.
        const txt = await res.text();
        throw new Error(`status ${res.status}: ${txt}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      // If unauthorized, we might just show locked.
      const message = e instanceof Error ? e.message : "failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000); // refresh every 30s
    return () => clearInterval(id);
  }, [load]);

  if (loading) return <div className="p-4 text-muted-foreground">Loading analytics...</div>;
  if (err) return <div className="p-4 text-destructive">Error loading analytics: {err}</div>;
  if (!data) return <div className="p-4 text-muted-foreground">No analytics</div>;

  return (
    <div className="space-y-6">
      <SummaryCards totalViews={data.total_views} uniqueViews={data.unique_views} />

      {/* Detailed Analytics Section - Locked for Free users */}
      <div className="relative">
        {!isPro && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-[2px] rounded-xl">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl p-8 rounded-2xl border border-white/20 dark:border-white/10 max-w-sm w-full mx-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlock Advanced Analytics</h3>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                Upgrade to Pro to see detailed charts, visitor locations, and referrers.
              </p>
              <Link href="/subscription" className="w-full">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white shadow-lg shadow-orange-500/20">
                  Unlock Pro Features
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Blur fake data if not pro, or real data if pro */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${!isPro ? 'opacity-70 pointer-events-none filter blur-[1.5px]' : ''}`}>
          <div className="md:col-span-2">
            <Card>
              <CardBody>
                <h3 className="text-sm font-semibold mb-4 text-foreground">Daily views</h3>
                {/* Show real chart if available (blurred for free), or fake chart if empty */}
                {
                  (data.daily && data.daily.length > 0) ? (
                    <TimelineChart daily={data.daily} />
                  ) : (
                    <TimelineChart daily={Array(7).fill(0).map((_, i) => ({ day: new Date(Date.now() - i * 86400000).toISOString(), count: Math.floor(Math.random() * 50) }))} />
                  )
                }
              </CardBody>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="text-sm font-semibold mb-4 text-foreground">Top referrers</h3>
                <ul className="space-y-2">
                  {(data.referrers && data.referrers.length > 0) ? (
                    data.referrers.map((r, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="truncate text-foreground">{r.referrer || "Direct"}</span>
                        <span className="font-medium text-foreground">{r.count}</span>
                      </li>
                    ))
                  ) : (
                    [
                      { referrer: 'google.com', count: 120 },
                      { referrer: 'linkedin.com', count: 85 },
                      { referrer: 'twitter.com', count: 42 },
                      { referrer: 'instagram.com', count: 15 }
                    ].map((r, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="truncate text-foreground">{r.referrer || "Direct"}</span>
                        <span className="font-medium text-foreground">{r.count}</span>
                      </li>
                    ))
                  )}
                  {data.referrers?.length === 0 && isPro && (
                    <li className="text-sm text-muted-foreground">No referrers yet</li>
                  )}
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="text-sm font-semibold mb-4 text-foreground">Recent views</h3>
                {(data.recent && data.recent.length > 0) ? (
                  <RecentViews rows={data.recent.slice(0, 8)} />
                ) : (
                  <RecentViews rows={Array(5).fill(null).map((_, i) => ({
                    id: `mock-${i}`,
                    referrer: 'google.com',
                    viewed_at: new Date().toISOString(),
                    user_agent: 'Mozilla/5.0...',
                    city: 'San Francisco',
                    country: 'US'
                  }))} />
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
