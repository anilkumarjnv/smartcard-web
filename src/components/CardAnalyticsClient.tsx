// src/components/CardAnalyticsClient.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import TimelineChart from "./TimelineChart";
import RecentViews from "./RecentViews";
import { SummaryCards } from "@/components/analytics/SummaryCards";
import { Card, CardBody } from "@/components/ui/Card";

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

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/analytics/${cardId}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`status ${res.status}: ${txt}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Daily views</h3>
              <TimelineChart daily={data.daily} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Top referrers</h3>
              <ul className="space-y-2">
                {data.referrers.length === 0 && (
                  <li className="text-sm text-muted-foreground">No referrers yet</li>
                )}
                {data.referrers.map((r) => (
                  <li key={String(r.referrer) + r.count} className="flex justify-between text-sm">
                    <span className="truncate text-foreground">{r.referrer || "Direct"}</span>
                    <span className="font-medium text-foreground">{r.count}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Recent views</h3>
              <RecentViews rows={data.recent.slice(0, 8)} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
