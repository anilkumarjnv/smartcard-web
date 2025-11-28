// src/components/CardAnalyticsClient.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import TimelineChart from "./TimelineChart";
import RecentViews from "./RecentViews";
import SummaryCards from "./summaryCards";
// import SummaryCards from "./SummaryCards";

type Analytics = {
  total_views: number;
  unique_views: number;
  daily: { day: string; count: number }[];
  referrers: { referrer: string | null; count: number }[];
  recent: Array<{ id: string; referrer: string | null; viewed_at: string; user_agent: string }>;
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

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (err) return <div className="p-4 text-red-500">Error loading analytics: {err}</div>;
  if (!data) return <div className="p-4">No analytics</div>;

  return (
    <div className="space-y-6 p-4">
      <SummaryCards total={data.total_views} unique={data.unique_views} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-semibold mb-2">Daily views</h3>
            <TimelineChart daily={data.daily} />
          </div>
        </div>
        <div>
          <div className="bg-white shadow rounded p-4 mb-4">
            <h3 className="text-sm font-semibold mb-2">Top referrers</h3>
            <ul className="space-y-2">
              {data.referrers.map((r) => (
                <li key={String(r.referrer) + r.count} className="flex justify-between text-sm">
                  <span className="truncate">{r.referrer || "direct"}</span>
                  <span className="font-medium">{r.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-semibold mb-2">Recent views</h3>
            <RecentViews rows={data.recent.slice(0, 8)} />
          </div>
        </div>
      </div>
    </div>
  );
}
